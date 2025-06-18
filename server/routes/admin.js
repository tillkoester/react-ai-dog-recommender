const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Admin = require('../models/Admin');
const QuizResponse = require('../models/QuizResponse');
const Rating = require('../models/Rating');
const Content = require('../models/Content');

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// Permission check middleware
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    next();
  };
};

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    const { email, password } = value;

    // Check if admin exists
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update activity
    await admin.updateActivity('login', 'Admin logged in', req.ip);

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    res.json({
      success: true,
      data: {
        token,
        admin: admin.toJSON()
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get admin profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.admin.toJSON()
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total quiz responses
    const totalQuizzes = await QuizResponse.countDocuments();
    const completedQuizzes = await QuizResponse.countDocuments({ isCompleted: true });
    
    // Weekly stats
    const weeklyQuizzes = await QuizResponse.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });
    
    const weeklyCompleted = await QuizResponse.countDocuments({
      createdAt: { $gte: oneWeekAgo },
      isCompleted: true
    });

    // Monthly stats
    const monthlyQuizzes = await QuizResponse.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    // Total ratings
    const totalRatings = await Rating.countDocuments();
    
    // Average rating
    const avgRatingResult = await Rating.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$starRating' }
        }
      }
    ]);
    
    const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0;

    // Geographic distribution
    const geographicDistribution = await QuizResponse.aggregate([
      {
        $group: {
          _id: '$step1.geographicLocation',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Industry distribution
    const industryDistribution = await QuizResponse.aggregate([
      {
        $group: {
          _id: '$step1.industryPreference',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Completion rate by step
    const step1Completed = await QuizResponse.countDocuments({
      step1: { $exists: true }
    });
    
    const step2Completed = await QuizResponse.countDocuments({
      step2: { $exists: true }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalQuizzes,
          completedQuizzes,
          completionRate: totalQuizzes > 0 ? (completedQuizzes / totalQuizzes * 100).toFixed(1) : 0,
          totalRatings,
          avgRating: avgRating.toFixed(1)
        },
        trends: {
          weeklyQuizzes,
          weeklyCompleted,
          weeklyCompletionRate: weeklyQuizzes > 0 ? (weeklyCompleted / weeklyQuizzes * 100).toFixed(1) : 0,
          monthlyQuizzes
        },
        stepCompletion: {
          step1: {
            completed: step1Completed,
            rate: totalQuizzes > 0 ? (step1Completed / totalQuizzes * 100).toFixed(1) : 0
          },
          step2: {
            completed: step2Completed,
            rate: totalQuizzes > 0 ? (step2Completed / totalQuizzes * 100).toFixed(1) : 0
          },
          final: {
            completed: completedQuizzes,
            rate: totalQuizzes > 0 ? (completedQuizzes / totalQuizzes * 100).toFixed(1) : 0
          }
        },
        demographics: {
          geographic: geographicDistribution,
          industry: industryDistribution
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// Get quiz responses with pagination
router.get('/quiz-responses', auth, checkPermission('canViewAnalytics'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { status, industry, location, startDate, endDate } = req.query;
    
    // Build filter
    const filter = {};
    
    if (status === 'completed') {
      filter.isCompleted = true;
    } else if (status === 'incomplete') {
      filter.isCompleted = false;
    }
    
    if (industry) {
      filter['step1.industryPreference'] = industry;
    }
    
    if (location) {
      filter['step1.geographicLocation'] = location;
    }
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const total = await QuizResponse.countDocuments(filter);
    const responses = await QuizResponse.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('sessionId currentStep isCompleted step1.industryPreference step1.geographicLocation createdAt completedAt');

    res.json({
      success: true,
      data: {
        responses,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: responses.length,
          totalItems: total
        }
      }
    });
  } catch (error) {
    console.error('Get quiz responses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz responses'
    });
  }
});

// Get detailed quiz response
router.get('/quiz-responses/:sessionId', auth, checkPermission('canViewAnalytics'), async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const response = await QuizResponse.findOne({ sessionId });
    
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Quiz response not found'
      });
    }

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Get quiz response error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz response'
    });
  }
});

module.exports = router;
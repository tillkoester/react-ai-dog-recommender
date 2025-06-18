const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Rating = require('../models/Rating');
const QuizResponse = require('../models/QuizResponse');

// Validation schema for rating submission
const ratingSchema = Joi.object({
  sessionId: Joi.string().required(),
  ratingType: Joi.string().valid(
    'step1_result',
    'step2_result',
    'final_result',
    'brand_position',
    'strengths_matrix',
    'hero_slogans',
    'differentiators',
    'brand_voice',
    'client_avatar',
    'market_analysis',
    'competitive_mapping',
    'launch_roadmap',
    'premium_services',
    'business_model'
  ).required(),
  resultIndex: Joi.number().min(0).default(0),
  starRating: Joi.number().min(1).max(5).required(),
  categoryRatings: Joi.object({
    accuracy: Joi.number().min(1).max(5),
    relevance: Joi.number().min(1).max(5),
    actionability: Joi.number().min(1).max(5),
    creativity: Joi.number().min(1).max(5),
    marketFit: Joi.number().min(1).max(5)
  }).optional(),
  feedback: Joi.object({
    liked: Joi.string().max(1000),
    disliked: Joi.string().max(1000),
    improvements: Joi.string().max(1000)
  }).optional(),
  confidenceLevel: Joi.string().valid(
    'Very confident - I can implement immediately',
    'Confident - I understand the strategy',
    'Somewhat confident - I need more guidance',
    'Not confident - This feels overwhelming',
    'Uncertain - I need professional help'
  ).optional()
});

// Submit or update a rating
router.post('/', async (req, res) => {
  try {
    const { error, value } = ratingSchema.validate(req.body);
    
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
    
    const { sessionId, ratingType, resultIndex, ...ratingData } = value;
    
    // Verify quiz session exists
    const quizResponse = await QuizResponse.findOne({ sessionId });
    
    if (!quizResponse) {
      return res.status(404).json({
        success: false,
        message: 'Quiz session not found'
      });
    }
    
    // Get user demographics for analytics
    const userDemographics = {
      geographicLocation: quizResponse.step1?.geographicLocation,
      industryPreference: quizResponse.step1?.industryPreference,
      experienceLevel: quizResponse.step1?.experienceLevel,
      cityMarketSize: quizResponse.step1?.cityMarketSize
    };
    
    // Check if rating already exists
    const existingRating = await Rating.findOne({ 
      sessionId, 
      ratingType, 
      resultIndex 
    });
    
    if (existingRating) {
      // Update existing rating
      Object.assign(existingRating, {
        ...ratingData,
        userDemographics,
        isUpdated: true,
        originalRatingId: existingRating._id
      });
      
      await existingRating.save();
      
      res.json({
        success: true,
        message: 'Rating updated successfully',
        data: {
          ratingId: existingRating._id,
          isUpdate: true
        }
      });
    } else {
      // Create new rating
      const rating = new Rating({
        sessionId,
        ratingType,
        resultIndex,
        ...ratingData,
        userDemographics
      });
      
      await rating.save();
      
      res.status(201).json({
        success: true,
        message: 'Rating submitted successfully',
        data: {
          ratingId: rating._id,
          isUpdate: false
        }
      });
    }
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating'
    });
  }
});

// Get ratings for a specific session
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const ratings = await Rating.find({ sessionId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: ratings
    });
  } catch (error) {
    console.error('Error getting session ratings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get session ratings'
    });
  }
});

// Get average ratings for a specific type
router.get('/average/:ratingType', async (req, res) => {
  try {
    const { ratingType } = req.params;
    const { 
      geographicLocation, 
      industryPreference, 
      experienceLevel,
      startDate,
      endDate 
    } = req.query;
    
    // Build filter criteria
    const filters = {};
    
    if (geographicLocation) {
      filters['userDemographics.geographicLocation'] = geographicLocation;
    }
    
    if (industryPreference) {
      filters['userDemographics.industryPreference'] = industryPreference;
    }
    
    if (experienceLevel) {
      filters['userDemographics.experienceLevel'] = experienceLevel;
    }
    
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }
    
    const averageRatings = await Rating.getAverageRatings(ratingType, filters);
    
    res.json({
      success: true,
      data: averageRatings[0] || {
        _id: ratingType,
        avgStarRating: 0,
        avgAccuracy: 0,
        avgRelevance: 0,
        avgActionability: 0,
        avgCreativity: 0,
        avgMarketFit: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    });
  } catch (error) {
    console.error('Error getting average ratings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get average ratings'
    });
  }
});

// Get rating analytics
router.get('/analytics', async (req, res) => {
  try {
    const { 
      groupBy = 'ratingType',
      startDate,
      endDate,
      geographicLocation,
      industryPreference 
    } = req.query;
    
    // Build match criteria
    const matchCriteria = {};
    
    if (startDate || endDate) {
      matchCriteria.createdAt = {};
      if (startDate) matchCriteria.createdAt.$gte = new Date(startDate);
      if (endDate) matchCriteria.createdAt.$lte = new Date(endDate);
    }
    
    if (geographicLocation) {
      matchCriteria['userDemographics.geographicLocation'] = geographicLocation;
    }
    
    if (industryPreference) {
      matchCriteria['userDemographics.industryPreference'] = industryPreference;
    }
    
    // Build aggregation pipeline
    const pipeline = [
      { $match: matchCriteria }
    ];
    
    if (groupBy === 'ratingType') {
      pipeline.push({
        $group: {
          _id: '$ratingType',
          avgStarRating: { $avg: '$starRating' },
          avgAccuracy: { $avg: '$categoryRatings.accuracy' },
          avgRelevance: { $avg: '$categoryRatings.relevance' },
          avgActionability: { $avg: '$categoryRatings.actionability' },
          avgCreativity: { $avg: '$categoryRatings.creativity' },
          avgMarketFit: { $avg: '$categoryRatings.marketFit' },
          totalRatings: { $sum: 1 },
          ratingDistribution: { $push: '$starRating' }
        }
      });
    } else if (groupBy === 'geographic') {
      pipeline.push({
        $group: {
          _id: '$userDemographics.geographicLocation',
          avgStarRating: { $avg: '$starRating' },
          totalRatings: { $sum: 1 },
          ratingTypes: { $addToSet: '$ratingType' }
        }
      });
    } else if (groupBy === 'industry') {
      pipeline.push({
        $group: {
          _id: '$userDemographics.industryPreference',
          avgStarRating: { $avg: '$starRating' },
          totalRatings: { $sum: 1 },
          ratingTypes: { $addToSet: '$ratingType' }
        }
      });
    } else if (groupBy === 'confidence') {
      pipeline.push({
        $group: {
          _id: '$confidenceLevel',
          avgStarRating: { $avg: '$starRating' },
          totalRatings: { $sum: 1 }
        }
      });
    }
    
    // Add rating distribution calculation for ratingType grouping
    if (groupBy === 'ratingType') {
      pipeline.push({
        $addFields: {
          ratingDistribution: {
            1: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 1] } } } },
            2: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 2] } } } },
            3: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 3] } } } },
            4: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 4] } } } },
            5: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 5] } } } }
          }
        }
      });
    }
    
    pipeline.push({ $sort: { totalRatings: -1 } });
    
    const analytics = await Rating.aggregate(pipeline);
    
    // Get overall statistics
    const overallStats = await Rating.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: null,
          totalRatings: { $sum: 1 },
          avgStarRating: { $avg: '$starRating' },
          uniqueSessions: { $addToSet: '$sessionId' },
          ratingTypes: { $addToSet: '$ratingType' }
        }
      },
      {
        $addFields: {
          uniqueSessionCount: { $size: '$uniqueSessions' },
          uniqueRatingTypeCount: { $size: '$ratingTypes' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        analytics,
        overallStats: overallStats[0] || {
          totalRatings: 0,
          avgStarRating: 0,
          uniqueSessionCount: 0,
          uniqueRatingTypeCount: 0
        },
        groupBy,
        filters: {
          startDate,
          endDate,
          geographicLocation,
          industryPreference
        }
      }
    });
  } catch (error) {
    console.error('Error getting rating analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get rating analytics'
    });
  }
});

// Get recent ratings with feedback
router.get('/feedback/recent', async (req, res) => {
  try {
    const { limit = 20, ratingType, minRating, maxRating } = req.query;
    
    const query = {
      $or: [
        { 'feedback.liked': { $exists: true, $ne: '' } },
        { 'feedback.disliked': { $exists: true, $ne: '' } },
        { 'feedback.improvements': { $exists: true, $ne: '' } }
      ]
    };
    
    if (ratingType) {
      query.ratingType = ratingType;
    }
    
    if (minRating || maxRating) {
      query.starRating = {};
      if (minRating) query.starRating.$gte = parseInt(minRating);
      if (maxRating) query.starRating.$lte = parseInt(maxRating);
    }
    
    const recentRatings = await Rating.find(query)
      .select('ratingType starRating categoryRatings feedback confidenceLevel userDemographics createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: recentRatings
    });
  } catch (error) {
    console.error('Error getting recent feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recent feedback'
    });
  }
});

module.exports = router;
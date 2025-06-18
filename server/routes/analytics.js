const express = require('express');
const router = express.Router();
const QuizResponse = require('../models/QuizResponse');
const Rating = require('../models/Rating');

// Get basic analytics (public endpoint)
router.get('/overview', async (req, res) => {
  try {
    // Basic public statistics
    const totalQuizzes = await QuizResponse.countDocuments();
    const completedQuizzes = await QuizResponse.countDocuments({ isCompleted: true });
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

    // Industry distribution (top 5)
    const topIndustries = await QuizResponse.aggregate([
      { $match: { 'step1.industryPreference': { $exists: true } } },
      {
        $group: {
          _id: '$step1.industryPreference',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        totalQuizzes,
        completedQuizzes,
        completionRate: totalQuizzes > 0 ? Math.round(completedQuizzes / totalQuizzes * 100) : 0,
        totalRatings,
        avgRating: Math.round(avgRating * 10) / 10,
        topIndustries: topIndustries.map(item => ({
          industry: item._id,
          count: item.count
        }))
      }
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics overview'
    });
  }
});

// Get completion funnel data
router.get('/funnel', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Quiz funnel analysis
    const totalStarted = await QuizResponse.countDocuments(dateFilter);
    
    const step1Completed = await QuizResponse.countDocuments({
      ...dateFilter,
      step1: { $exists: true }
    });
    
    const step2Completed = await QuizResponse.countDocuments({
      ...dateFilter,
      step2: { $exists: true }
    });
    
    const finalCompleted = await QuizResponse.countDocuments({
      ...dateFilter,
      isCompleted: true
    });

    // Calculate drop-off rates
    const funnel = [
      {
        step: 'Started',
        count: totalStarted,
        percentage: 100,
        dropOff: 0
      },
      {
        step: 'Step 1 Completed',
        count: step1Completed,
        percentage: totalStarted > 0 ? Math.round(step1Completed / totalStarted * 100) : 0,
        dropOff: totalStarted - step1Completed
      },
      {
        step: 'Step 2 Completed',
        count: step2Completed,
        percentage: totalStarted > 0 ? Math.round(step2Completed / totalStarted * 100) : 0,
        dropOff: step1Completed - step2Completed
      },
      {
        step: 'Final Results',
        count: finalCompleted,
        percentage: totalStarted > 0 ? Math.round(finalCompleted / totalStarted * 100) : 0,
        dropOff: step2Completed - finalCompleted
      }
    ];

    res.json({
      success: true,
      data: {
        funnel,
        summary: {
          totalStarted,
          finalCompleted,
          overallConversionRate: totalStarted > 0 ? Math.round(finalCompleted / totalStarted * 100) : 0
        }
      }
    });
  } catch (error) {
    console.error('Funnel analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch funnel analytics'
    });
  }
});

// Get user demographics
router.get('/demographics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Geographic distribution
    const geographic = await QuizResponse.aggregate([
      { $match: { ...dateFilter, 'step1.geographicLocation': { $exists: true } } },
      {
        $group: {
          _id: '$step1.geographicLocation',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Industry distribution
    const industry = await QuizResponse.aggregate([
      { $match: { ...dateFilter, 'step1.industryPreference': { $exists: true } } },
      {
        $group: {
          _id: '$step1.industryPreference',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Experience level distribution
    const experience = await QuizResponse.aggregate([
      { $match: { ...dateFilter, 'step1.experienceLevel': { $exists: true } } },
      {
        $group: {
          _id: '$step1.experienceLevel',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // City market size distribution
    const marketSize = await QuizResponse.aggregate([
      { $match: { ...dateFilter, 'step1.cityMarketSize': { $exists: true } } },
      {
        $group: {
          _id: '$step1.cityMarketSize',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        geographic: geographic.map(item => ({
          location: item._id,
          count: item.count
        })),
        industry: industry.map(item => ({
          industry: item._id,
          count: item.count
        })),
        experience: experience.map(item => ({
          level: item._id,
          count: item.count
        })),
        marketSize: marketSize.map(item => ({
          size: item._id,
          count: item.count
        }))
      }
    });
  } catch (error) {
    console.error('Demographics analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch demographics analytics'
    });
  }
});

// Get rating performance analytics
router.get('/rating-performance', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Overall rating statistics
    const ratingStats = await Rating.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalRatings: { $sum: 1 },
          avgStarRating: { $avg: '$starRating' },
          avgAccuracy: { $avg: '$categoryRatings.accuracy' },
          avgRelevance: { $avg: '$categoryRatings.relevance' },
          avgActionability: { $avg: '$categoryRatings.actionability' },
          avgCreativity: { $avg: '$categoryRatings.creativity' },
          avgMarketFit: { $avg: '$categoryRatings.marketFit' }
        }
      }
    ]);

    // Rating distribution
    const ratingDistribution = await Rating.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$starRating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Performance by rating type
    const performanceByType = await Rating.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$ratingType',
          count: { $sum: 1 },
          avgRating: { $avg: '$starRating' }
        }
      },
      { $sort: { avgRating: -1 } }
    ]);

    // Recent feedback with high ratings
    const recentHighRatings = await Rating.find({
      ...dateFilter,
      starRating: { $gte: 4 },
      $or: [
        { 'feedback.liked': { $exists: true, $ne: '' } },
        { 'feedback.improvements': { $exists: true, $ne: '' } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('ratingType starRating feedback createdAt');

    // Low ratings for improvement
    const recentLowRatings = await Rating.find({
      ...dateFilter,
      starRating: { $lte: 2 },
      $or: [
        { 'feedback.disliked': { $exists: true, $ne: '' } },
        { 'feedback.improvements': { $exists: true, $ne: '' } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('ratingType starRating feedback createdAt');

    const stats = ratingStats[0] || {
      totalRatings: 0,
      avgStarRating: 0,
      avgAccuracy: 0,
      avgRelevance: 0,
      avgActionability: 0,
      avgCreativity: 0,
      avgMarketFit: 0
    };

    res.json({
      success: true,
      data: {
        overview: {
          totalRatings: stats.totalRatings,
          avgStarRating: Math.round(stats.avgStarRating * 10) / 10,
          categoryAverages: {
            accuracy: Math.round(stats.avgAccuracy * 10) / 10,
            relevance: Math.round(stats.avgRelevance * 10) / 10,
            actionability: Math.round(stats.avgActionability * 10) / 10,
            creativity: Math.round(stats.avgCreativity * 10) / 10,
            marketFit: Math.round(stats.avgMarketFit * 10) / 10
          }
        },
        distribution: ratingDistribution.map(item => ({
          stars: item._id,
          count: item.count
        })),
        performanceByType: performanceByType.map(item => ({
          type: item._id,
          count: item.count,
          avgRating: Math.round(item.avgRating * 10) / 10
        })),
        feedback: {
          positive: recentHighRatings,
          negative: recentLowRatings
        }
      }
    });
  } catch (error) {
    console.error('Rating performance analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rating performance analytics'
    });
  }
});

// Get time-series data for charts
router.get('/time-series', async (req, res) => {
  try {
    const { metric = 'completions', period = '7d' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    let groupBy;
    
    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
          hour: { $hour: '$createdAt' }
        };
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    let data;

    if (metric === 'completions') {
      // Quiz completions over time
      data = await QuizResponse.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            isCompleted: true
          }
        },
        {
          $group: {
            _id: groupBy,
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } }
      ]);
    } else if (metric === 'ratings') {
      // Ratings over time
      data = await Rating.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: groupBy,
            count: { $sum: 1 },
            avgRating: { $avg: '$starRating' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } }
      ]);
    }

    res.json({
      success: true,
      data: {
        metric,
        period,
        startDate,
        endDate: now,
        points: data || []
      }
    });
  } catch (error) {
    console.error('Time series analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch time series data'
    });
  }
});

module.exports = router;
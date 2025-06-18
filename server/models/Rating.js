const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    ref: 'QuizResponse'
  },
  
  // What was rated
  ratingType: {
    type: String,
    enum: [
      'step1_result', // Personal Brand Profile Summaries
      'step2_result', // Market Positioning Strategies
      'final_result', // Final comprehensive result
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
    ],
    required: true
  },
  
  // Which result index (for multiple results per step)
  resultIndex: {
    type: Number,
    default: 0
  },
  
  // Star rating (1-5)
  starRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  // Detailed ratings by category
  categoryRatings: {
    accuracy: {
      type: Number,
      min: 1,
      max: 5
    },
    relevance: {
      type: Number,
      min: 1,
      max: 5
    },
    actionability: {
      type: Number,
      min: 1,
      max: 5
    },
    creativity: {
      type: Number,
      min: 1,
      max: 5
    },
    marketFit: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Feedback text
  feedback: {
    liked: {
      type: String,
      maxlength: 1000
    },
    disliked: {
      type: String,
      maxlength: 1000
    },
    improvements: {
      type: String,
      maxlength: 1000
    }
  },
  
  // Implementation confidence
  confidenceLevel: {
    type: String,
    enum: [
      'Very confident - I can implement immediately',
      'Confident - I understand the strategy',
      'Somewhat confident - I need more guidance',
      'Not confident - This feels overwhelming',
      'Uncertain - I need professional help'
    ]
  },
  
  // User demographics (copied from quiz response for analytics)
  userDemographics: {
    geographicLocation: String,
    industryPreference: String,
    experienceLevel: String,
    cityMarketSize: String
  },
  
  // Rating metadata
  ratedAt: {
    type: Date,
    default: Date.now
  },
  
  // For updated ratings
  isUpdated: {
    type: Boolean,
    default: false
  },
  originalRatingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating'
  }
}, {
  timestamps: true
});

// Indexes
RatingSchema.index({ sessionId: 1, ratingType: 1, resultIndex: 1 }, { unique: true });
RatingSchema.index({ ratingType: 1 });
RatingSchema.index({ starRating: 1 });
RatingSchema.index({ 'userDemographics.geographicLocation': 1 });
RatingSchema.index({ 'userDemographics.industryPreference': 1 });
RatingSchema.index({ createdAt: -1 });

// Virtual for average category rating
RatingSchema.virtual('averageCategoryRating').get(function() {
  const ratings = this.categoryRatings;
  const values = Object.values(ratings).filter(val => val != null);
  
  if (values.length === 0) return null;
  
  return values.reduce((sum, rating) => sum + rating, 0) / values.length;
});

// Static method to get average ratings for a rating type
RatingSchema.statics.getAverageRatings = function(ratingType, filters = {}) {
  const matchCriteria = { ratingType, ...filters };
  
  return this.aggregate([
    { $match: matchCriteria },
    {
      $group: {
        _id: '$ratingType',
        avgStarRating: { $avg: '$starRating' },
        avgAccuracy: { $avg: '$categoryRatings.accuracy' },
        avgRelevance: { $avg: '$categoryRatings.relevance' },
        avgActionability: { $avg: '$categoryRatings.actionability' },
        avgCreativity: { $avg: '$categoryRatings.creativity' },
        avgMarketFit: { $avg: '$categoryRatings.marketFit' },
        totalRatings: { $sum: 1 },
        ratingDistribution: {
          $push: '$starRating'
        }
      }
    },
    {
      $addFields: {
        ratingDistribution: {
          1: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 1] } } } },
          2: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 2] } } } },
          3: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 3] } } } },
          4: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 4] } } } },
          5: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 5] } } } }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Rating', RatingSchema);
const mongoose = require('mongoose');

const QuizResponseSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Step 1: Personal Foundation
  step1: {
    // Section 1: Current Situation
    jobStatus: {
      type: String,
      enum: [
        'Student',
        'Full-time Employee',
        'Part-time Employee',
        'Freelancer',
        'Entrepreneur with Existing Business',
        'Between Jobs',
        'Retired'
      ]
    },
    industryPreference: {
      type: String,
      enum: [
        'Coaching & Consulting',
        'Marketing & Advertising',
        'Technology & IT',
        'Health & Wellness',
        'Education & Training',
        'E-commerce & Retail',
        'Finance & Investment',
        'Real Estate',
        'Design & Creative',
        'Content Creation',
        'Project Management',
        'Human Resources',
        'Sales',
        'Hospitality',
        'Trades & Crafts',
        'Other',
        'Let AI Decide ✨'
      ]
    },
    experienceLevel: {
      type: String,
      enum: [
        'Less than 2 years',
        '2-5 years',
        '5-10 years',
        '10-15 years',
        'Over 15 years'
      ]
    },
    educationBackground: {
      type: String,
      enum: [
        'Self-taught/Career Changer',
        'Vocational Training',
        'Bachelor\'s Degree',
        'Master\'s Degree',
        'PhD/Doctorate',
        'Multiple Degrees'
      ]
    },
    geographicLocation: {
      type: String,
      enum: [
        'North America',
        'Europe',
        'Asia-Pacific',
        'Latin America',
        'Middle East & Africa',
        'Other'
      ]
    },
    cityMarketSize: {
      type: String,
      enum: [
        'Major Metropolitan (1M+)',
        'Mid-size City (100K-1M)',
        'Small City (10K-100K)',
        'Rural/Small Town (<10K)'
      ]
    },
    timeAvailability: {
      type: String,
      enum: [
        'Less than 5 hours',
        '5-10 hours',
        '10-20 hours',
        '20-30 hours',
        'More than 30 hours per week'
      ]
    },
    budgetRange: {
      type: String,
      enum: [
        'Under $50',
        '$50-150',
        '$150-500',
        '$500-1000',
        'Over $1000 monthly'
      ]
    },
    techComfort: {
      type: String,
      enum: [
        'Early Adopter - I try everything new',
        'Tech Enthusiast - I learn eagerly',
        'Cautious but Open - I need proven results',
        'Traditional - I prefer established methods'
      ]
    },
    supportSystem: {
      type: String,
      enum: [
        'Working completely alone',
        'Family/Friends support me',
        'I have mentors or coaches',
        'I\'m part of a community',
        'I have a small team'
      ]
    },
    
    // Section 2: Skills & Strengths
    coreSkills: [{
      type: String,
      enum: [
        'Subject Matter Expertise',
        'Communication & Presentation',
        'Problem Solving & Analysis',
        'Strategic Thinking',
        'Creativity & Innovation',
        'Technical Understanding',
        'Project Management',
        'Sales & Business Development',
        'Leadership & Team Management',
        'Empathy & People Skills'
      ]
    }],
    uniqueExperiences: {
      type: String,
      minlength: 50,
      maxlength: 1000
    },
    passionsInterests: {
      type: String,
      minlength: 30,
      maxlength: 500
    },
    
    // Section 3: Goals & Vision
    focusArea: {
      type: String,
      enum: [
        'Personal Development',
        'Business & Entrepreneurship',
        'Marketing & Sales',
        'Technology & Innovation',
        'Health & Lifestyle',
        'Education & Knowledge',
        'Creativity & Design',
        'Sustainability & Environment',
        'Finance & Investment',
        'Leadership & Management',
        'Other'
      ]
    },
    customFocus: String,
    primaryGoals: [{
      type: String,
      enum: [
        'Help others succeed',
        'Be recognized as an expert',
        'Create new career opportunities',
        'Build side income ($500-2000/month)',
        'Become fully self-employed',
        'Scale existing business',
        'Achieve financial independence'
      ]
    }],
    timeline: {
      type: String,
      enum: [
        'Within 3 months',
        'Within 6 months',
        'Within 12 months',
        'I\'m building long-term (2+ years)'
      ]
    },
    biggestConcerns: {
      type: String,
      minlength: 30,
      maxlength: 500
    }
  },
  
  // Step 2: Market Intelligence & Research
  step2: {
    problemsToSolve: {
      type: String,
      required: function() { return this.currentStep >= 2; },
      minlength: 50,
      maxlength: 1000
    },
    idealTargetGroup: {
      type: String,
      required: function() { return this.currentStep >= 2; },
      minlength: 60,
      maxlength: 1000
    },
    industryTrendsImpact: {
      type: String,
      required: function() { return this.currentStep >= 2; },
      minlength: 50,
      maxlength: 1000
    },
    uniqueAdvantages: {
      type: String,
      required: function() { return this.currentStep >= 2; },
      minlength: 40,
      maxlength: 1000
    },
    marketChallenges: {
      type: String,
      required: function() { return this.currentStep >= 2; },
      minlength: 30,
      maxlength: 1000
    },
    regionalConsiderations: {
      type: String,
      maxlength: 1000
    },
    competitiveLandscape: {
      type: String,
      maxlength: 1000
    }
  },
  
  // AI Generated Results
  aiResults: {
    step1Results: [{
      title: String,
      content: String,
      generatedAt: { type: Date, default: Date.now },
      prompt: String,
      model: String
    }],
    step2Results: [{
      title: String,
      content: String,
      generatedAt: { type: Date, default: Date.now },
      prompt: String,
      model: String
    }],
    finalResults: {
      brandPosition: String,
      strengthsMatrix: String,
      heroSlogans: [String],
      keyDifferentiators: [String],
      brandVoice: String,
      idealClientAvatar: String,
      marketAnalysis: String,
      competitiveMapping: String,
      launchRoadmap: String,
      premiumServices: String,
      successIndicators: [String],
      businessModel: String,
      generatedAt: { type: Date, default: Date.now }
    }
  },
  
  // Quiz Progress
  currentStep: {
    type: Number,
    default: 1,
    min: 1,
    max: 3
  },
  completedSteps: [{
    step: Number,
    completedAt: Date
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  
  // User Metadata
  userAgent: String,
  ipAddress: String,
  referrer: String,
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,
  
  // Analytics
  timeSpent: {
    step1: Number, // seconds
    step2: Number,
    total: Number
  },
  
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
QuizResponseSchema.index({ sessionId: 1 });
QuizResponseSchema.index({ isCompleted: 1 });
QuizResponseSchema.index({ 'step1.geographicLocation': 1 });
QuizResponseSchema.index({ 'step1.industryPreference': 1 });
QuizResponseSchema.index({ createdAt: -1 });

// Update lastUpdated on save
QuizResponseSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Virtual for completion percentage
QuizResponseSchema.virtual('completionPercentage').get(function() {
  return (this.currentStep / 3) * 100;
});

module.exports = mongoose.model('QuizResponse', QuizResponseSchema);
const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  // Content identification
  contentType: {
    type: String,
    enum: [
      'quiz_question',
      'ai_prompt',
      'ui_text',
      'help_text',
      'email_template',
      'landing_page'
    ],
    required: true
  },
  
  section: {
    type: String,
    enum: [
      'step1_section1', // Current Situation
      'step1_section2', // Skills & Strengths
      'step1_section3', // Goals & Vision
      'step2', // Market Intelligence
      'results', // Final Results
      'general' // General content
    ]
  },
  
  // Question-specific fields
  questionId: {
    type: String,
    unique: true,
    sparse: true
  },
  
  question: {
    text: String,
    type: {
      type: String,
      enum: ['dropdown', 'multiselect', 'textarea', 'text', 'checkbox', 'radio']
    },
    options: [String],
    validation: {
      required: Boolean,
      minLength: Number,
      maxLength: Number,
      pattern: String
    },
    helpText: String,
    placeholder: String
  },
  
  // AI Prompt fields
  prompt: {
    title: String,
    systemPrompt: String,
    userPrompt: String,
    temperature: {
      type: Number,
      min: 0,
      max: 2,
      default: 0.7
    },
    maxTokens: {
      type: Number,
      default: 2000
    },
    model: {
      type: String,
      default: 'gpt-4'
    },
    variables: [String], // Variables that can be injected
    fallbackContent: String
  },
  
  // UI Text fields
  uiText: {
    key: String,
    content: String,
    context: String // Where this text is used
  },
  
  // Content versions for A/B testing
  versions: [{
    version: String,
    content: mongoose.Schema.Types.Mixed,
    isActive: {
      type: Boolean,
      default: false
    },
    performance: {
      views: {
        type: Number,
        default: 0
      },
      conversions: {
        type: Number,
        default: 0
      },
      conversionRate: {
        type: Number,
        default: 0
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Content metadata
  title: {
    type: String,
    required: true
  },
  description: String,
  
  // Status and lifecycle
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Ordering and grouping
  order: {
    type: Number,
    default: 0
  },
  
  category: String,
  tags: [String],
  
  // Localization
  language: {
    type: String,
    default: 'en'
  },
  
  // Analytics
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    interactions: {
      type: Number,
      default: 0
    },
    lastViewed: Date,
    avgTimeSpent: Number // seconds
  },
  
  // Audit trail
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  
  changeLog: [{
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    changeType: {
      type: String,
      enum: ['created', 'updated', 'published', 'archived', 'deleted']
    },
    changes: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String
  }]
}, {
  timestamps: true
});

// Indexes
ContentSchema.index({ contentType: 1, section: 1 });
ContentSchema.index({ questionId: 1 });
ContentSchema.index({ 'uiText.key': 1 });
ContentSchema.index({ status: 1, isActive: 1 });
ContentSchema.index({ order: 1 });

// Virtual for active version
ContentSchema.virtual('activeVersion').get(function() {
  return this.versions.find(v => v.isActive) || this.versions[0];
});

// Method to get content based on version
ContentSchema.methods.getContent = function(version = null) {
  if (version) {
    const specificVersion = this.versions.find(v => v.version === version);
    return specificVersion ? specificVersion.content : null;
  }
  
  const activeVersion = this.versions.find(v => v.isActive);
  return activeVersion ? activeVersion.content : this.versions[0]?.content;
};

// Method to create new version
ContentSchema.methods.createVersion = function(versionData, createdBy) {
  const version = {
    version: versionData.version || `v${this.versions.length + 1}`,
    content: versionData.content,
    isActive: versionData.isActive || false,
    createdAt: new Date()
  };
  
  // If setting as active, deactivate others
  if (version.isActive) {
    this.versions.forEach(v => v.isActive = false);
  }
  
  this.versions.push(version);
  
  // Add to change log
  this.changeLog.unshift({
    changedBy: createdBy,
    changeType: 'updated',
    changes: { newVersion: version.version },
    notes: `Created new version: ${version.version}`
  });
  
  return this.save();
};

// Method to update analytics
ContentSchema.methods.updateAnalytics = function(type, value = 1) {
  if (type === 'view') {
    this.analytics.views += value;
    this.analytics.lastViewed = new Date();
  } else if (type === 'interaction') {
    this.analytics.interactions += value;
  } else if (type === 'timeSpent') {
    // Update average time spent
    const totalTime = (this.analytics.avgTimeSpent || 0) * this.analytics.views;
    this.analytics.avgTimeSpent = (totalTime + value) / this.analytics.views;
  }
  
  return this.save();
};

// Static method to get content by key
ContentSchema.statics.getByKey = function(key, section = null) {
  const query = { 'uiText.key': key, isActive: true, status: 'published' };
  if (section) query.section = section;
  
  return this.findOne(query);
};

// Static method to get questions for a section
ContentSchema.statics.getQuestions = function(section, activeOnly = true) {
  const query = { 
    contentType: 'quiz_question', 
    section,
    ...(activeOnly && { isActive: true, status: 'published' })
  };
  
  return this.find(query).sort({ order: 1 });
};

// Static method to get AI prompts
ContentSchema.statics.getPrompt = function(section, promptType) {
  const query = { 
    contentType: 'ai_prompt', 
    section,
    'prompt.title': promptType,
    isActive: true,
    status: 'published'
  };
  
  return this.findOne(query);
};

module.exports = mongoose.model('Content', ContentSchema);
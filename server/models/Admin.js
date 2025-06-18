const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  role: {
    type: String,
    enum: ['Super Admin', 'Content Manager', 'Analyst'],
    default: 'Content Manager'
  },
  
  permissions: {
    canManageContent: {
      type: Boolean,
      default: true
    },
    canManageUsers: {
      type: Boolean,
      default: false
    },
    canViewAnalytics: {
      type: Boolean,
      default: true
    },
    canManageSettings: {
      type: Boolean,
      default: false
    },
    canManageAI: {
      type: Boolean,
      default: false
    }
  },
  
  profile: {
    firstName: String,
    lastName: String,
    department: String,
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Password reset
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Two-factor authentication
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  
  // Activity tracking
  lastActivity: {
    type: Date,
    default: Date.now
  },
  
  activityLog: [{
    action: String,
    details: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String
  }]
}, {
  timestamps: true
});

// Indexes
AdminSchema.index({ email: 1 });
AdminSchema.index({ username: 1 });
AdminSchema.index({ isActive: 1 });

// Virtual for full name
AdminSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName || ''} ${this.profile.lastName || ''}`.trim();
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update last activity
AdminSchema.methods.updateActivity = function(action, details, ipAddress) {
  this.lastActivity = new Date();
  this.profile.loginCount += 1;
  
  // Add to activity log (keep last 50 entries)
  this.activityLog.unshift({
    action,
    details,
    ipAddress,
    timestamp: new Date()
  });
  
  if (this.activityLog.length > 50) {
    this.activityLog = this.activityLog.slice(0, 50);
  }
  
  return this.save();
};

// Check if user has permission
AdminSchema.methods.hasPermission = function(permission) {
  if (this.role === 'Super Admin') return true;
  return this.permissions[permission] || false;
};

// Remove sensitive data from JSON output
AdminSchema.methods.toJSON = function() {
  const admin = this.toObject();
  delete admin.password;
  delete admin.twoFactorSecret;
  delete admin.resetPasswordToken;
  return admin;
};

module.exports = mongoose.model('Admin', AdminSchema);
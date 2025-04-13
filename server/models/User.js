const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    select: false,
    minlength: [8, 'Password must be at least 8 characters']
  },
  age: {
    type: Number,
    required: true,
    min: [18, "You must be at least 18 years old"],
    max: [120, "Please enter a valid age"]
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female", "other"],
      message: "{VALUE} is not a valid gender"
    },
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'merchant', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Merchant specific fields
  businessName: {
    type: String,
    required: function() { 
      return this.role === 'merchant' && !this.isNew;
    }
  },
  businessAddress: {
    type: String,
    required: function() { 
      return this.role === 'merchant' && !this.isNew;
    }
  },
  phoneNumber: {
    type: String,
    required: function() { 
      return this.role === 'merchant' && !this.isNew;
    }
  },
  taxId: {
    type: String,
    required: function() { 
      return this.role === 'merchant' && !this.isNew;
    }
  },
  businessType: {
    type: String,
    enum: ['retail', 'handicraft', 'art', 'food', 'other'],
    required: function() { 
      return this.role === 'merchant' && !this.isNew;
    }
  },
  // Common fields
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  passwordResetAttempts: {
    type: Number,
    default: 0
  },
  lastPasswordResetAttempt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Check if password was changed after a given timestamp
UserSchema.methods.changedPasswordAfter = function(timestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return timestamp < changedTimestamp
  }
  return false
}

module.exports = mongoose.model("User", UserSchema)

const mongoose = require("mongoose")

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // OTP expires after 10 minutes
  }
})

// Create index on email field for faster lookups
OTPSchema.index({ email: 1 });

// Create TTL index on createdAt field
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model("OTP", OTPSchema)

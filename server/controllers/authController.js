const User = require('../models/User');
const { sendOTP } = require('../utils/sendOTP');
const OTP = require('../models/OTP');

// Merchant Registration
exports.merchantSignup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      age,
      gender,
      businessName,
      businessAddress,
      phoneNumber,
      taxId,
      businessType
    } = req.body;

    console.log('Starting merchant registration process for:', email);

    // Validate required fields
    if (!fullName || !email || !password || !age || !gender || !businessName || 
        !businessAddress || !phoneNumber || !taxId || !businessType) {
      console.log('Missing required fields:', {
        hasFullName: !!fullName,
        hasEmail: !!email,
        hasPassword: !!password,
        hasAge: !!age,
        hasGender: !!gender,
        hasBusinessName: !!businessName,
        hasBusinessAddress: !!businessAddress,
        hasPhoneNumber: !!phoneNumber,
        hasTaxId: !!taxId,
        hasBusinessType: !!businessType
      });
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Check if merchant already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Create merchant user
    const merchant = new User({
      fullName,
      email,
      password,
      age: Number(age),
      gender,
      role: 'merchant',
      businessName,
      businessAddress,
      phoneNumber,
      taxId,
      businessType,
      isVerified: false
    });

    // Validate the merchant object before saving
    const validationError = merchant.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: Object.values(validationError.errors).map(err => err.message)
      });
    }

    console.log('Attempting to send OTP to:', email);
    // Send OTP before saving
    const otpSent = await sendOTP(email);
    if (!otpSent) {
      console.error('Failed to send OTP to:', email);
      return res.status(500).json({
        success: false,
        error: 'Failed to send verification email. Please try again.'
      });
    }
    console.log('OTP sent successfully to:', email);

    // Save the merchant
    try {
      await merchant.save();
      console.log('Merchant saved successfully:', email);
      return res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for verification OTP.'
      });
    } catch (saveError) {
      console.error('Error saving merchant:', saveError);
      // If save fails, try to delete the OTP
      try {
        await OTP.findOneAndDelete({ email });
      } catch (otpError) {
        console.error('Error cleaning up OTP after save failure:', otpError);
      }
      return res.status(500).json({
        success: false,
        error: 'Failed to complete registration. Please try again.'
      });
    }
  } catch (error) {
    console.error('Merchant signup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
    });
  }
}; 
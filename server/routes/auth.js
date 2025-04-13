const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { generateToken } = require("../utils/tokenUtils")
const { sendOTP } = require("../utils/sendOTP")
const { verifyOTP } = require("../middleware/otpMiddleware")
const { merchantSignup } = require("../controllers/authController")

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post("/register", async (req, res) => {
  const { fullName, email, password, age, gender } = req.body

  try {
    // Check if user already exists
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create user but don't save yet
    user = new User({
      fullName,
      email,
      password,
      age,
      gender,
      role: "user", // Default role
    })

    // Send OTP
    const otpSent = await sendOTP(email)

    if (!otpSent) {
      return res.status(500).json({ message: "Failed to send OTP" })
    }

    // Save user to database
    await user.save()

    res.status(200).json({
      message: "Registration initiated. Please verify your email with the OTP sent.",
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST api/auth/verify-otp
// @desc    Verify OTP and complete registration
// @access  Public
router.post("/verify-otp", verifyOTP, async (req, res) => {
  const { email } = req.body

  try {
    // Find user and mark as verified
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.isVerified = true
    await user.save()

    // Generate JWT token
    const token = generateToken(user._id)

    // For merchants, send a different message
    if (user.role === 'merchant') {
      return res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token,
        message: 'Email verified. Your merchant account is pending admin approval.'
      })
    }

    // For regular users
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token
    })
  } catch (error) {
    console.error('OTP verification error:', error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    console.log("Login attempt for email:", email)

    // Find user
    const user = await User.findOne({ email }).select("+password")
    console.log("User found:", user ? "Yes" : "No")

    if (!user) {
      console.log("User not found")
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)
    console.log("Password match:", isMatch ? "Yes" : "No")

    if (!isMatch) {
      console.log("Password does not match")
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check if user is verified
    if (!user.isVerified) {
      console.log("User not verified")
      // Resend OTP
      await sendOTP(email)
      return res.status(401).json({
        message: "Email not verified. A new OTP has been sent to your email.",
      })
    }

    // Generate JWT token
    const token = generateToken(user._id)
    console.log("Token generated successfully")

    // Return user data with role
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token,
    })
  } catch (error) {
    console.error("Login error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST api/auth/resend-otp
// @desc    Resend OTP
// @access  Public
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body

  try {
    // Check if user exists
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Send OTP
    const otpSent = await sendOTP(email)

    if (!otpSent) {
      return res.status(500).json({ message: "Failed to send OTP" })
    }

    res.status(200).json({ message: "OTP sent successfully" })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST api/auth/create-admin
// @desc    Create an admin account (protected route)
// @access  Private/Admin
router.post("/create-admin", async (req, res) => {
  const { fullName, email, password, age, gender } = req.body

  try {
    // Check if user already exists
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create admin user
    user = new User({
      fullName,
      email,
      password,
      age,
      gender,
      role: "admin",
      isVerified: true, // Admin accounts are automatically verified
    })

    await user.save()

    res.status(201).json({
      message: "Admin account created successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST api/auth/create-merchant
// @desc    Create a merchant account (protected route)
// @access  Private/Admin
router.post("/create-merchant", async (req, res) => {
  const { fullName, email, password, age, gender } = req.body

  try {
    // Check if user already exists
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create merchant user
    user = new User({
      fullName,
      email,
      password,
      age,
      gender,
      role: "merchant",
      isVerified: true, // Merchant accounts are automatically verified
    })

    await user.save()

    res.status(201).json({
      message: "Merchant account created successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST api/auth/merchant/signup
// @desc    Register a merchant
// @access  Public
router.post("/merchant/signup", merchantSignup);

module.exports = router

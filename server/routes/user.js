const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const { checkRole } = require("../middleware/roleCheck")
const { getGiftSuggestions } = require("../utils/geminiClient")
const Product = require("../models/Product")
const Suggestion = require("../models/Suggestion")
const Order = require("../models/Order")
const User = require("../models/User")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const { sendPasswordChangeEmail } = require("../utils/emailUtils")

// @route   POST api/user/questionnaire
// @desc    Submit questionnaire and get AI suggestions
// @access  Private (User)
router.post("/questionnaire", protect, checkRole(["user"]), async (req, res) => {
  try {
    const { age, gender, occasion, budget, relation } = req.body

    // Get suggestions from Gemini AI
    const suggestions = await getGiftSuggestions({
      age,
      gender,
      occasion,
      budget,
      relation,
    })

    // Process each suggestion
    const suggestedProducts = []
    const aiResponse = []

    // Get existing products and their categories
    const existingCategories = new Set()
    
    for (const suggestion of suggestions) {
      // Check if we already have a product from this category
      if (existingCategories.has(suggestion.category) && existingCategories.size >= 2) {
        continue // Skip if we already have enough products from this category
      }

      // Check if product already exists
      let product = await Product.findOne({
        name: { $regex: new RegExp(suggestion.productName, "i") },
      })

      // If product doesn't exist, create it
      if (!product) {
        product = await Product.create({
          name: suggestion.productName,
          description: suggestion.description,
          basePrice: suggestion.price,
          category: suggestion.category,
          stock: 10, // Default stock
          status: 'active',
          image: '/images/products/placeholder.jpg',
          merchant: req.user._id, // Using current user as merchant
          variants: [{
            name: "Standard",
            price: suggestion.price,
            stock: 10,
            attributes: new Map([["type", "standard"]]),
            sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          }],
          variantAttributes: [{
            name: "type",
            values: ["standard"]
          }]
        })

        aiResponse.push(`New product added: ${suggestion.productName}`)
      } else {
        aiResponse.push(`Existing product found: ${suggestion.productName}`)
      }

      suggestedProducts.push(product._id)
      existingCategories.add(suggestion.category)
    }

    // Create a suggestion record
    const suggestion = await Suggestion.create({
      user: req.user._id,
      occasion,
      budget,
      relation,
      recipientAge: age,
      recipientGender: gender,
      suggestedProducts,
      aiResponse: aiResponse.join(", "),
      createdAt: new Date() // Ensure we have a fresh timestamp
    })

    // Populate the products before sending response
    await suggestion.populate('suggestedProducts')

    res.status(201).json(suggestion)
  } catch (error) {
    console.error("Error processing questionnaire:", error)
    res.status(500).json({ message: "Error processing questionnaire" })
  }
})

// @route   GET api/user/suggestions
// @desc    Get user's previous suggestions
// @access  Private (User)
router.get("/suggestions", protect, checkRole(["user"]), async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ user: req.user._id })
      .populate("suggestedProducts")
      .sort({ createdAt: -1 })

    res.status(200).json(suggestions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET api/user/orders
// @desc    Get user's orders
// @access  Private (User)
router.get("/orders", protect, checkRole(["user"]), async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate("products.product")
      .sort({ createdAt: -1 })

    res.status(200).json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST api/user/checkout
// @desc    Process checkout and create order
// @access  Private (User)
router.post("/checkout", protect, checkRole(["user"]), async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { products, totalAmount, shippingAddress, paymentDetails } = req.body

    // Validate payment (mock)
    // In a real app, you would integrate with a payment gateway
    const paymentSuccessful = true

    if (!paymentSuccessful) {
      return res.status(400).json({ message: "Payment failed" })
    }

    // Validate stock availability for all products
    for (const item of products) {
      const product = await Product.findById(item.product)
      if (!product) {
        await session.abortTransaction()
        return res.status(404).json({ message: `Product ${item.product} not found` })
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction()
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        })
      }
    }

    // Create order
    const order = await Order.create([{
      customer: req.user._id,  // Changed from user to customer to match schema
      products: products.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        merchant: item.merchant || req.user._id // Fallback to user if merchant not specified
      })),
      totalAmount,
      paymentStatus: "completed",  // Changed from "paid" to "completed" to match enum
      shippingAddress: shippingAddress,  // Use the address object directly
      paymentMethod: paymentDetails.method || "demo_card",
      status: "processing",
      tax: totalAmount * 0.18,  // 18% tax
      shippingCost: 0  // Free shipping
    }], { session })

    // Update product stock
    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.product,
        { 
          $inc: { stock: -item.quantity },
          $set: { 
            lastUpdated: new Date(),
            updatedBy: req.user._id
          }
        },
        { session }
      )
    }

    // Commit transaction
    await session.commitTransaction()

    // Populate product details for response
    const populatedOrder = await Order.findById(order[0]._id)
      .populate("products.product")
      .populate("customer", "fullName email")

    res.status(201).json(populatedOrder)
  } catch (error) {
    // Only abort if the transaction hasn't been committed
    if (session.inTransaction()) {
      await session.abortTransaction()
    }
    console.error("Error processing checkout:", error)
    res.status(500).json({ message: "Error processing checkout" })
  } finally {
    session.endSession()
  }
})

// @route   PUT api/user/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const { fullName, age, gender } = req.body

    // Validate input data
    if (!fullName || !age || !gender) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Validate age
    const ageNum = Number(age)
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      return res.status(400).json({ message: "Please enter a valid age between 18 and 120" })
    }

    // Validate gender
    if (!["male", "female", "other"].includes(gender)) {
      return res.status(400).json({ message: "Invalid gender value" })
    }

    // Find user and update profile
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user profile with validation
    user.fullName = fullName.trim()
    user.age = ageNum
    user.gender = gender

    try {
      await user.validate() // Run mongoose validation
    } catch (validationError) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: Object.values(validationError.errors).map(err => err.message)
      })
    }

    await user.save()

    // Return updated user data (excluding password and sensitive fields)
    const updatedUser = await User.findById(user._id)
      .select("-password -passwordResetAttempts -lastPasswordResetAttempt")

    res.status(200).json(updatedUser)
  } catch (error) {
    console.error("Error updating profile:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT api/user/password
// @desc    Update user password
// @access  Private
router.put("/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password field
    const user = await User.findById(req.user._id).select("+password +passwordResetAttempts +lastPasswordResetAttempt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for rate limiting
    const now = new Date();
    const resetWindow = 15 * 60 * 1000; // 15 minutes in milliseconds
    const maxAttempts = 5;

    if (user.lastPasswordResetAttempt && 
        (now.getTime() - user.lastPasswordResetAttempt.getTime()) < resetWindow) {
      
      if (user.passwordResetAttempts >= maxAttempts) {
        const timeLeft = Math.ceil((resetWindow - (now.getTime() - user.lastPasswordResetAttempt.getTime())) / 60000);
        return res.status(429).json({ 
          message: `Too many password reset attempts. Please try again in ${timeLeft} minutes.` 
        });
      }
    } else {
      // Reset attempts if outside window
      user.passwordResetAttempts = 0;
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      user.passwordResetAttempts += 1;
      user.lastPasswordResetAttempt = now;
      await user.save();
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    user.passwordChangedAt = now;
    user.passwordResetAttempts = 0;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router

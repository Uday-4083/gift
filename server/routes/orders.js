const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const Order = require("../models/Order")

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress, paymentDetails } = req.body

    // Validate payment (mock)
    // In a real app, you would integrate with a payment gateway
    const paymentSuccessful = true

    if (!paymentSuccessful) {
      return res.status(400).json({ message: "Payment failed" })
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      products,
      totalAmount,
      paymentStatus: "paid",
      shippingAddress,
    })

    // Populate product details for response
    const populatedOrder = await Order.findById(order._id).populate("products.product")

    res.status(201).json(populatedOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "fullName email").populate("products.product")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if user is authorized to view this order
    if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" })
    }

    res.status(200).json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

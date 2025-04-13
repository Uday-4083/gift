const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const { checkRole } = require("../middleware/roleCheck")
const Product = require("../models/Product")
const User = require("../models/User")
const Order = require("../models/Order")
const Suggestion = require("../models/Suggestion")

// @route   GET api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin)
router.get("/dashboard", protect, checkRole(["admin"]), async (req, res) => {
  try {
    // Get counts
    const userCount = await User.countDocuments({ role: "user" })
    const productCount = await Product.countDocuments()
    const orderCount = await Order.countDocuments()
    const merchantCount = await User.countDocuments({ role: "merchant" })

    // Get recent orders with proper population
    const recentOrders = await Order.find()
      .populate("customer", "fullName email")
      .populate("products.product")
      .populate("products.merchant", "fullName")
      .sort({ createdAt: -1 })
      .limit(10)

    // Get AI suggestions not in catalog
    const pendingAiProducts = await Product.find({
      addedBy: "AI",
      isApproved: false,
    }).limit(10)

    res.status(200).json({
      counts: {
        users: userCount,
        products: productCount,
        orders: orderCount,
        merchants: merchantCount,
      },
      recentOrders,
      pendingAiProducts,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET api/admin/products
// @desc    Get all products
// @access  Private (Admin)
router.get("/products", protect, checkRole(["admin"]), async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.status(200).json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST api/admin/products
// @desc    Create a product
// @access  Private (Admin)
router.post("/products", protect, checkRole(["admin"]), async (req, res) => {
  try {
    const { productName, description, price, stockCount, category, imageUrl, discount } = req.body

    const product = await Product.create({
      productName,
      description,
      price,
      stockCount,
      category,
      imageUrl,
      discount: discount || 0,
      addedBy: "admin",
      isApproved: true,
    })

    res.status(201).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT api/admin/products/:id
// @desc    Update a product
// @access  Private (Admin)
router.put("/products/:id", protect, checkRole(["admin"]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json(updatedProduct)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE api/admin/products/:id
// @desc    Delete a product
// @access  Private (Admin)
router.delete("/products/:id", protect, checkRole(["admin"]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    await product.remove()

    res.status(200).json({ message: "Product removed" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT api/admin/products/:id/approve
// @desc    Approve a product
// @access  Private (Admin)
router.put("/products/:id/approve", protect, checkRole(["admin"]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    product.isApproved = true
    product.stockCount = req.body.stockCount || 10 // Default stock

    await product.save()

    res.status(200).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET api/admin/orders
// @desc    Get all orders
// @access  Private (Admin)
router.get("/orders", protect, checkRole(["admin"]), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const total = await Order.countDocuments()
    
    const orders = await Order.find()
      .populate("customer", "fullName email")
      .populate("products.product")
      .populate("products.merchant", "fullName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    res.status(200).json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT api/admin/orders/:id
// @desc    Update order status
// @access  Private (Admin)
router.put("/orders/:id", protect, checkRole(["admin"]), async (req, res) => {
  try {
    const { status } = req.body

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    order.status = status
    await order.save()

    res.status(200).json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET api/admin/merchants
// @desc    Get all merchants
// @access  Private (Admin)
router.get("/merchants", protect, checkRole(["admin"]), async (req, res) => {
  try {
    const merchants = await User.find({ role: "merchant" }).select("-password")
    res.status(200).json(merchants)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST api/admin/merchants
// @desc    Create a merchant account
// @access  Private (Admin)
router.post("/merchants", protect, checkRole(["admin"]), async (req, res) => {
  try {
    const { fullName, email, password, age, gender } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create merchant
    const merchant = await User.create({
      fullName,
      email,
      password,
      age,
      gender,
      role: "merchant",
      isVerified: true, // Admin-created merchants are pre-verified
    })

    res.status(201).json({
      _id: merchant._id,
      fullName: merchant.fullName,
      email: merchant.email,
      role: merchant.role,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

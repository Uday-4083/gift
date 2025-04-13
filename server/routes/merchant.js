const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const { checkRole } = require("../middleware/roleCheck")
const Product = require("../models/Product")
const Order = require("../models/Order")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Ensure uploads directory exists
const uploadDir = "uploads/products"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (extname && mimetype) {
      return cb(null, true)
    }
    cb(new Error("Only image files are allowed!"))
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
})

// @route   GET api/merchant/products
// @desc    Get merchant's products with search, filter and pagination
// @access  Private (Merchant)
router.get("/products", protect, checkRole(["merchant"]), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const category = req.query.category
    const status = req.query.status
    const sortBy = req.query.sortBy || "createdAt"
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

    const query = {
      merchant: req.user._id
    }

    // Add search condition
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    }

    // Add category filter
    if (category) {
      query.category = category
    }

    // Add status filter
    if (status) {
      query.status = status
    }

    // Get total count for pagination
    const total = await Product.countDocuments(query)

    // Get products with pagination and sorting
    const products = await Product.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)

    // Get unique categories for filter options
    const categories = await Product.distinct("category", { merchant: req.user._id })

    res.status(200).json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        categories
      }
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ success: false, message: "Error fetching products" })
  }
})

// @route   GET api/merchant/orders
// @desc    Get merchant's orders with filtering and pagination
// @access  Private (Merchant)
router.get("/orders", protect, checkRole(["merchant"]), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const status = req.query.status
    const sortBy = req.query.sortBy || "createdAt"
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

    const query = {
      "products.merchant": req.user._id
    }

    if (status) {
      query.status = status
    }

    const total = await Order.countDocuments(query)

    const orders = await Order.find(query)
      .populate("customer", "fullName email")
      .populate("products.product")
      .sort({ [sortBy]: sortOrder })
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
    console.error("Error fetching orders:", error)
    res.status(500).json({ message: "Error fetching orders" })
  }
})

// @route   PATCH api/merchant/orders/:id
// @desc    Update order status and tracking
// @access  Private (Merchant)
router.patch("/orders/:id", protect, checkRole(["merchant"]), async (req, res) => {
  try {
    const { id } = req.params
    const { status, trackingNumber } = req.body

    const order = await Order.findOne({
      _id: id,
      "products.merchant": req.user._id
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (status) {
      order.status = status
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber
    }

    await order.save()
    
    res.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    res.status(500).json({ message: "Error updating order" })
  }
})

// @route   POST api/merchant/products
// @desc    Add a new product
// @access  Private (Merchant)
router.post("/products", protect, checkRole(["merchant"]), async (req, res) => {
  try {
    const { name, description, basePrice, category, stock, imageUrl } = req.body;

    // Validate required fields
    if (!name || !description || !basePrice || !category || !stock || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, description, basePrice, category, stock, imageUrl"
      });
    }

    // Create SKU
    const sku = `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create default variant
    const defaultVariant = {
      name: "Standard",
      price: Number(basePrice),
      stock: Number(stock),
      attributes: new Map([["type", "standard"]]),
      sku
    };

    const product = await Product.create({
      name,
      description,
      basePrice: Number(basePrice),
      category,
      stock: Number(stock),
      imageUrl,
      merchant: req.user._id,
      status: "active",
      variants: [defaultVariant],
      variantAttributes: [{
        name: "type",
        values: ["standard"]
      }]
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully and is pending admin approval",
      data: product
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error adding product. Please try again."
    });
  }
});

// @route   GET api/merchant/dashboard
// @desc    Get merchant dashboard data
// @access  Private (Merchant)
router.get("/dashboard", protect, checkRole(["merchant"]), async (req, res) => {
  try {
    // Get product counts
    const approvedProducts = await Product.countDocuments({
      merchant: req.user._id,
      status: "active"
    })

    const pendingProducts = await Product.countDocuments({
      merchant: req.user._id,
      status: "pending"
    })

    // Get total orders and revenue
    const totalOrders = await Order.countDocuments({ 
      "products.merchant": req.user._id
    })

    // Calculate revenue from completed orders
    const completedOrders = await Order.find({ 
      "products.merchant": req.user._id,
      status: "completed"
    })
    
    const revenue = completedOrders.reduce((total, order) => {
      const merchantProducts = order.products.filter(p => 
        p.merchant.toString() === req.user._id.toString()
      )
      return total + merchantProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0)
    }, 0)

    // Get recent orders
    const recentOrders = await Order.find({ "products.merchant": req.user._id })
      .populate("customer", "fullName email")
      .populate("products.product")
      .sort({ createdAt: -1 })
      .limit(5)

    res.status(200).json({
      stats: {
        approvedProducts,
        pendingProducts,
        totalProducts: approvedProducts + pendingProducts,
        totalOrders,
        revenue
      },
      recentOrders
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    res.status(500).json({ message: "Error fetching dashboard data" })
  }
})

// @route   GET api/merchant/dashboard/stats
// @desc    Get merchant dashboard statistics
// @access  Private (Merchant)
router.get("/dashboard/stats", protect, checkRole(["merchant"]), async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ merchant: req.user._id })
    const totalOrders = await Order.countDocuments({ 
      "products.merchant": req.user._id,
      status: { $in: ["completed", "processing"] }
    })

    // Calculate revenue
    const orders = await Order.find({ 
      "products.merchant": req.user._id,
      status: "completed"
    })
    
    const revenue = orders.reduce((total, order) => {
      const merchantProducts = order.products.filter(p => p.merchant.toString() === req.user._id.toString())
      return total + merchantProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0)
    }, 0)

    // Get recent orders
    const recentOrders = await Order.find({ "products.merchant": req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("customer", "name")
      .lean()

    const formattedRecentOrders = recentOrders.map(order => ({
      id: order._id,
      customerName: order.customer.name,
      productCount: order.products.filter(p => p.merchant.toString() === req.user._id.toString()).length,
      total: order.products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
      status: order.status,
      date: order.createdAt
    }))

    res.json({
      totalProducts,
      totalOrders,
      revenue,
      recentOrders: formattedRecentOrders
    })
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error)
    res.status(500).json({ message: "Error fetching dashboard statistics" })
  }
})

// @route   PATCH api/merchant/products/:id/status
// @desc    Update product status
// @access  Private (Merchant)
router.patch("/products/:id/status", protect, checkRole(["merchant"]), async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const product = await Product.findOne({ _id: id, merchant: req.user._id })
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    product.status = status
    await product.save()
    
    res.json(product)
  } catch (error) {
    console.error("Error updating product status:", error)
    res.status(500).json({ message: "Error updating product status" })
  }
})

module.exports = router

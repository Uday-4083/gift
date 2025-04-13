const express = require("express")
const router = express.Router()
const Product = require("../models/Product")

// @route   GET api/gifts
// @desc    Get all approved products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query
    let query = { status: "active" }

    // Add category filter if provided
    if (category) {
      query.category = category
    }

    // Add price range filter if provided
    if (minPrice || maxPrice) {
      query.basePrice = {}
      if (minPrice) query.basePrice.$gte = Number(minPrice)
      if (maxPrice) query.basePrice.$lte = Number(maxPrice)
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    }

    const gifts = await Product.find(query)
    res.json(gifts)
  } catch (error) {
    console.error("Error fetching gifts:", error)
    res.status(500).json({ message: "Error fetching gifts" })
  }
})

// @route   GET api/gifts/:id
// @desc    Get product by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.status(200).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET api/gifts/categories
// @desc    Get all product categories
// @access  Public
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category", { status: "active" })
    res.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({ message: "Error fetching categories" })
  }
})

module.exports = router

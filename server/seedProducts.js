require("dotenv").config()
const mongoose = require("mongoose")
const Product = require("./models/Product")
const User = require("./models/User")
const productData = require("./utils/productData.json")
const connectDB = require("./config/db")

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await connectDB()
    console.log("Connected to MongoDB...")

    // Clear existing products
    await Product.deleteMany({})
    console.log("Cleared existing products...")

    // Find a merchant user to associate with products
    const merchant = await User.findOne({ role: "merchant" })
    if (!merchant) {
      throw new Error("No merchant user found. Please create a merchant user first.")
    }

    // Transform product data to match the Product schema
    const products = productData.map(product => ({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      category: product.category,
      stock: product.stock,
      image: product.image,
      merchant: merchant._id,
      status: "active",
      variants: [{
        name: "Standard",
        price: product.basePrice,
        stock: product.stock,
        attributes: new Map([["type", "standard"]]),
        sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }],
      variantAttributes: [{
        name: "type",
        values: ["standard"]
      }]
    }))

    // Insert products
    await Product.insertMany(products)
    console.log(`${products.length} products inserted successfully!`)

    process.exit(0)
  } catch (error) {
    console.error("Error seeding products:", error)
    process.exit(1)
  }
}

// Run the seeder
seedProducts() 
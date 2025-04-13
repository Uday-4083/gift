require("dotenv").config()
const mongoose = require("mongoose")
const User = require("../models/User")
const Product = require("../models/Product")
const bcrypt = require("bcryptjs")
const connectDB = require("../config/db")
const mergedProducts = require("./mergedProductData")

// Connect to MongoDB
const seedDatabase = async () => {
  try {
    await connectDB()
    console.log("Connected to MongoDB...")

    // Clear existing data
    await User.deleteMany()
    await Product.deleteMany()
    console.log("Data cleared...")

    // Create admin user
    const adminPassword = "admin123"
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(adminPassword, salt)

    const admin = await User.create({
      fullName: "Admin User",
      email: "admin@ecomm.com",
      password: hashedPassword,
      age: 30,
      gender: "other",
      role: "admin",
      isVerified: true,
    })

    console.log("Admin user created:", admin.email)

    // Create merchant user
    const merchant = await User.create({
      fullName: "Merchant User",
      email: "merchant@ecomm.com",
      password: hashedPassword,
      age: 35,
      gender: "other",
      role: "merchant",
      isVerified: true,
    })

    console.log("Merchant user created:", merchant.email)

    // Add merchant ID to all products
    const productsWithMerchant = mergedProducts.map(product => ({
      ...product,
      merchant: merchant._id
    }))

    // Insert all products
    await Product.insertMany(productsWithMerchant)
    console.log(`${productsWithMerchant.length} products inserted...`)

    console.log("\nDatabase seeded successfully!")
    console.log("\nLogin Credentials:")
    console.log("Admin - email: admin@ecomm.com, password: admin123")
    console.log("Merchant - email: merchant@ecomm.com, password: admin123")

    // Verify the users were created
    const adminCheck = await User.findOne({ email: "admin@ecomm.com" })
    const merchantCheck = await User.findOne({ email: "merchant@ecomm.com" })

    console.log("\nVerification:")
    console.log("Admin exists:", !!adminCheck)
    console.log("Merchant exists:", !!merchantCheck)

    // Print product categories summary
    const categories = await Product.distinct("category")
    console.log("\nProduct Categories:")
    for (const category of categories) {
      const count = await Product.countDocuments({ category })
      console.log(`${category}: ${count} products`)
    }

    // Print age group summary
    const ageGroups = await Product.distinct("ageGroup")
    console.log("\nAge Groups:")
    for (const ageGroup of ageGroups) {
      const count = await Product.countDocuments({ ageGroup })
      console.log(`${ageGroup}: ${count} products`)
    }

    // Print gender summary
    const genders = await Product.distinct("gender")
    console.log("\nGender Distribution:")
    for (const gender of genders) {
      const count = await Product.countDocuments({ gender })
      console.log(`${gender}: ${count} products`)
    }

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seeder
seedDatabase()

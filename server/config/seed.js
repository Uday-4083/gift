const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB Connected')

    // Clear existing users
    await User.deleteMany({})
    console.log('Cleared existing users')

    // Create admin user
    const adminUser = new User({
      fullName: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin123',
      age: 30,
      gender: 'male',
      role: 'admin',
      isVerified: true
    })

    // Create merchant user
    const merchantUser = new User({
      fullName: 'Merchant User',
      email: 'merchant@gmail.com',
      password: 'admin123',
      age: 30,
      gender: 'male',
      role: 'merchant',
      isVerified: true
    })

    // Save users
    await adminUser.save()
    await merchantUser.save()

    console.log('Default users created successfully')
    process.exit()
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedUsers() 
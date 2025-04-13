const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected...');

    // Delete existing admin if any
    await User.deleteOne({ role: 'admin' });

    // Create admin user
    const admin = new User({
      fullName: 'Admin User',
      email: 'admin@giftplatform.com',
      password: 'Admin@123',  // This will be hashed by the User model pre-save middleware
      age: 30,
      gender: 'other',
      role: 'admin',
      isVerified: true
    });

    await admin.save();

    console.log('Admin user seeded successfully');
    console.log('Admin Credentials:');
    console.log('Email: admin@giftplatform.com');
    console.log('Password: Admin@123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin(); 
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedMerchant = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected...');

    // Create merchant user
    const merchant = new User({
      fullName: 'Test Merchant',
      email: 'merchant@giftplatform.com',
      password: 'Merchant@123',
      age: 30,
      gender: 'other',
      role: 'merchant',
      isVerified: true,
      businessName: 'Test Gift Shop',
      businessAddress: '123 Gift Street, Gift City',
      phoneNumber: '1234567890',
      taxId: 'TAX123456',
      businessType: 'retail'
    });

    await merchant.save();

    console.log('Merchant user seeded successfully');
    console.log('Merchant Credentials:');
    console.log('Email: merchant@giftplatform.com');
    console.log('Password: Merchant@123');
    console.log('Business Details:');
    console.log('Business Name: Test Gift Shop');
    console.log('Business Type: retail');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding merchant:', error);
    process.exit(1);
  }
};

seedMerchant(); 
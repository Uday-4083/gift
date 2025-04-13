require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Use the standard MongoDB URI format with authentication if needed
const MONGODB_URI = 'mongodb://127.0.0.1:27017/giftoria';

const seedDefaultUsers = async () => {
  try {
    // Connect to MongoDB with proper options
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB...');

    // Delete all existing users
    await User.deleteMany({});
    console.log('Cleared existing users...');

    // Hash passwords
    const salt = await bcrypt.genSalt(12);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const merchantPassword = await bcrypt.hash('Merchant123', salt);

    // Create admin user with pre-hashed password
    const adminUser = new User({
      fullName: 'Admin User',
      email: 'admin@gmail.com',
      password: adminPassword,
      age: 30,
      gender: 'other',
      role: 'admin',
      isVerified: true,
      passwordResetAttempts: 0
    });

    // Create merchant user with pre-hashed password
    const merchantUser = new User({
      fullName: 'Merchant User',
      email: 'merchant@ecomm.com',
      password: merchantPassword,
      age: 35,
      gender: 'other',
      role: 'merchant',
      isVerified: true,
      passwordResetAttempts: 0
    });

    // Save users to database
    await adminUser.save();
    await merchantUser.save();

    console.log('Default users created successfully');
    console.log('Admin email: admin@gmail.com');
    console.log('Merchant email: merchant@ecomm.com');

    // Verify the users were created by fetching them
    const adminCheck = await User.findOne({ email: 'admin@gmail.com' });
    const merchantCheck = await User.findOne({ email: 'merchant@ecomm.com' });

    console.log('\nVerification of created users:');
    console.log('Admin exists:', !!adminCheck);
    console.log('Merchant exists:', !!merchantCheck);

    console.log('\nDefault users created successfully!');
    console.log('Admin credentials:');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin123');
    console.log('\nMerchant credentials:');
    console.log('Email: merchant@ecomm.com');
    console.log('Password: Merchant123');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB...');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedDefaultUsers(); 
const mongoose = require('mongoose');
const Product = require('../models/Product');
const productData = require('../utils/productData.json');
require('dotenv').config();

async function loadProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Create a default merchant (admin user)
    const defaultMerchant = '65f1c2d71f3b3c98b7777777'; // Replace with your admin user ID

    // Add merchant and default values to products
    const productsWithDefaults = productData.map(product => ({
      ...product,
      merchant: defaultMerchant,
      status: 'active',
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
    }));

    // Insert products
    await Product.insertMany(productsWithDefaults);
    console.log('Successfully loaded products');

    // Log summary
    const count = await Product.countDocuments();
    console.log(`Total products loaded: ${count}`);

  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
loadProducts(); 
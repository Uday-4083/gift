const Product = require('../models/Product');
const Order = require('../models/Order');
const AdminMessage = require('../models/AdminMessage');
const mongoose = require('mongoose');

// Get merchant dashboard stats
exports.getMerchantDashboardStats = async (req, res) => {
  try {
    const [products, orders] = await Promise.all([
      Product.find({ merchant: req.user.id }).select('stock price'),
      Order.find({ 'items.merchant': req.user.id }).select('totalAmount status items')
    ]);

    const totalRevenue = orders.filter(o => o.status === 'completed')
      .reduce((acc, order) => acc + order.totalAmount, 0);
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    const totalProducts = products.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalRevenue,
        lowStockProducts,
        pendingOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, basePrice, category, stock, imageUrl } = req.body;
    const sku = `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const product = new Product({
      name,
      description,
      basePrice,
      category,
      stock,
      imageUrl,
      sku,
      merchant: req.user.id,
      status: 'active'
    });

    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update product stock and price
exports.updateProduct = async (req, res) => {
  try {
    const { stock, price, isActive } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, merchant: req.user.id },
      { stock, price, isActive },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      merchant: req.user.id
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get merchant's products with inventory
exports.getMerchantProducts = async (req, res) => {
  try {
    const products = await Product.find({ merchant: req.user.id })
      .select('name sku price stock category isActive')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get merchant's orders
exports.getMerchantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.merchant': req.user.id })
      .select('orderNumber items.product items.quantity totalAmount status createdAt')
      .populate('items.product', 'name sku')
      .sort('-createdAt');

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { 
        _id: req.params.id, 
        'items.merchant': req.user.id,
        status: { $ne: 'completed' } // Can't update completed orders
      },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found or cannot be updated' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Contact admin or submit support request
exports.contactAdmin = async (req, res) => {
  try {
    const { subject, message, type } = req.body; // type can be 'support' or 'suggestion'
    const adminMessage = new AdminMessage({
      merchant: req.user.id,
      subject,
      message,
      type,
      status: 'pending'
    });
    await adminMessage.save();
    res.status(201).json({ success: true, data: adminMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get merchant's messages with admin
exports.getAdminMessages = async (req, res) => {
  try {
    const messages = await AdminMessage.find({ merchant: req.user.id })
      .select('subject message type status adminResponse responseDate createdAt')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; 
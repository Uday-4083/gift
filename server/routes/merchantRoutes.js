const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isMerchant } = require('../middleware/roleCheck');

// Import controllers
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getMerchantProducts,
  getMerchantOrders,
  getMerchantDashboardStats,
  contactAdmin
} = require('../controllers/merchantController');

// Essential Merchant Routes
router.get('/dashboard', auth, isMerchant, getMerchantDashboardStats);
router.get('/products', auth, isMerchant, getMerchantProducts);
router.post('/products', auth, isMerchant, addProduct);
router.put('/products/:id', auth, isMerchant, updateProduct);
router.delete('/products/:id', auth, isMerchant, deleteProduct);
router.get('/orders', auth, isMerchant, getMerchantOrders);
router.post('/contact-admin', auth, isMerchant, contactAdmin);

module.exports = router; 
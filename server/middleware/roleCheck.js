const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized for this role" })
    }

    next()
  }
}

// Middleware to check if user is a merchant
exports.isMerchant = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required' 
    });
  }

  if (req.user.role !== 'merchant') {
    return res.status(403).json({ 
      success: false, 
      error: 'Merchant access required' 
    });
  }

  next();
};

// Middleware to check if user is an admin
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required' 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      error: 'Admin access required' 
    });
  }

  next();
};

// Middleware to check if user is either merchant or admin
exports.isMerchantOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'merchant' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Access denied. Merchant or Admin access required.'
    });
  }
};

module.exports = { checkRole }

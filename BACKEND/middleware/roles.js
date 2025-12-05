const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'You must be logged in' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.',
        required: roles,
        your_role: req.user.role
      });
    }

    next();
  };
};

const isCustomer = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'You must be logged in' });
  }
  if (req.user.role !== 'Customer') {
    return res.status(403).json({ error: 'Access denied. Customers only.' });
  }
  next();
};

const isSpecialist = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'You must be logged in' });
  }
  if (req.user.role !== 'Specialist') {
    return res.status(403).json({ error: 'Access denied. Specialists only.' });
  }
  next();
};

const isSeller = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'You must be logged in' });
  }
  if (req.user.role !== 'Seller') {
    return res.status(403).json({ error: 'Access denied. Seller only.' });
  }
  next();
};

const isSellerOrSpecialist = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'You must be logged in' });
  }
  if (req.user.role !== 'Seller' && req.user.role !== 'Specialist') {
    return res.status(403).json({ error: 'Access denied. Seller or Specialist only.' });
  }
  next();
};

module.exports = {
  hasRole,
  isCustomer,
  isSpecialist,
  isSeller,
  isSellerOrSpecialist
};
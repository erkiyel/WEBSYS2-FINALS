const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'You must be logged in' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

const isCustomer = hasRole('Customer');
const isSpecialist = hasRole('Specialist');
const isSeller = hasRole('Seller');
const isSellerOrSpecialist = hasRole('Seller', 'Specialist');

module.exports = {
  hasRole,
  isCustomer,
  isSpecialist,
  isSeller,
  isSellerOrSpecialist
};
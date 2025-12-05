const {
  hasRole,
  isCustomer,
  isSpecialist,
  isSeller,
  isSellerOrSpecialist
} = require('../../middleware/roles');

describe('roles middleware', () => {
  let req, res, next;

  beforeEach(() => {
    next = jest.fn();
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  describe('hasRole', () => {
    test('returns 401 when not authenticated', () => {
      req = { isAuthenticated: () => false };
      const mw = hasRole('Admin');
      mw(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'You must be logged in' });
    });

    test('returns 403 when role not included', () => {
      req = { isAuthenticated: () => true, user: { role: 'Customer' } };
      const mw = hasRole('Seller', 'Admin');
      mw(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Access denied. Insufficient permissions.',
        required: ['Seller', 'Admin'],
        your_role: 'Customer'
      });
    });

    test('calls next when role included', () => {
      req = { isAuthenticated: () => true, user: { role: 'Seller' } };
      const mw = hasRole('Seller', 'Admin');
      mw(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('isCustomer', () => {
    test('401 when not authenticated', () => {
      req = { isAuthenticated: () => false };
      isCustomer(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('403 when wrong role', () => {
      req = { isAuthenticated: () => true, user: { role: 'Seller' } };
      isCustomer(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. Customers only.' });
    });

    test('calls next when Customer', () => {
      req = { isAuthenticated: () => true, user: { role: 'Customer' } };
      isCustomer(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('isSpecialist', () => {
    test('401 when not authenticated', () => {
      req = { isAuthenticated: () => false };
      isSpecialist(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('403 when wrong role', () => {
      req = { isAuthenticated: () => true, user: { role: 'Customer' } };
      isSpecialist(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. Specialists only.' });
    });

    test('calls next when Specialist', () => {
      req = { isAuthenticated: () => true, user: { role: 'Specialist' } };
      isSpecialist(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('isSeller', () => {
    test('401 when not authenticated', () => {
      req = { isAuthenticated: () => false };
      isSeller(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('403 when wrong role', () => {
      req = { isAuthenticated: () => true, user: { role: 'Customer' } };
      isSeller(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. Seller only.' });
    });

    test('calls next when Seller', () => {
      req = { isAuthenticated: () => true, user: { role: 'Seller' } };
      isSeller(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('isSellerOrSpecialist', () => {
    test('401 when not authenticated', () => {
      req = { isAuthenticated: () => false };
      isSellerOrSpecialist(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('403 when wrong role', () => {
      req = { isAuthenticated: () => true, user: { role: 'Customer' } };
      isSellerOrSpecialist(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. Seller or Specialist only.' });
    });

    test('calls next when Seller or Specialist', () => {
      req = { isAuthenticated: () => true, user: { role: 'Seller' } };
      isSellerOrSpecialist(req, res, next);
      expect(next).toHaveBeenCalled();

      next = jest.fn();
      req = { isAuthenticated: () => true, user: { role: 'Specialist' } };
      isSellerOrSpecialist(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});

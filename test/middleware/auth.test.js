const { isAuthenticated } = require('../../middleware/auth');

describe('isAuthenticated middleware', () => {
  let req, res, next;

  beforeEach(() => {
    next = jest.fn();
    res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
    };
  });

  test('calls next when authenticated', () => {
    req = { isAuthenticated: () => true };
    isAuthenticated(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('responds 401 when not authenticated', () => {
    req = { isAuthenticated: () => false };
    isAuthenticated(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'You must be logged in to access this resource' });
    expect(next).not.toHaveBeenCalled();
  });
});

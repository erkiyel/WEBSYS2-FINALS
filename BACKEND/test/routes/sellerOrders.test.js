jest.mock('../../middleware/auth', () => ({
  isAuthenticated: (req, res, next) => {
    const headerId = req.headers['x-test-user-id'];
    req.user = { user_id: headerId ? Number(headerId) : 1, role: req.headers['x-test-role'] || 'Seller' };
    return next();
  }
}));

jest.mock('../../middleware/roles', () => ({
  isSeller: (req, res, next) => {
    const role = req.headers['x-test-role'] || req.user?.role || 'Seller';
    if (role !== 'Seller') return res.status(403).json({ error: 'Access denied. Seller only.' });
    return next();
  },
  isSpecialist: (req, res, next) => {
    const role = req.headers['x-test-role'] || req.user?.role || 'Seller';
    if (role !== 'Specialist') return res.status(403).json({ error: 'Access denied. Specialists only.' });
    return next();
  }
}));

jest.mock('../../models', () => ({
  SellerOrder: { findAll: jest.fn(), findByPk: jest.fn(), create: jest.fn(), findOne: jest.fn() },
  SellerOrderItem: { create: jest.fn() },
  Specialist: { findByPk: jest.fn(), findOne: jest.fn() },
  SpecialistInventory: { findOne: jest.fn(), findAll: jest.fn(), findByPk: jest.fn() },
  ShopInventory: { findOrCreate: jest.fn() },
  Sequelize: { Op: {} }
}));

const request = require('supertest');
const dbMock = require('../../models');
let app;

beforeAll(() => { app = require('../../server'); });
afterEach(() => jest.clearAllMocks());

describe('SellerOrders routes', () => {
  test('GET /api/seller-orders returns list for seller', async () => {
    dbMock.SellerOrder.findAll.mockResolvedValue([{ seller_order_id: 1 }]);
    const res = await request(app).get('/api/seller-orders').set('x-test-role', 'Seller');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/seller-orders/:id returns 404 when missing', async () => {
    dbMock.SellerOrder.findByPk.mockResolvedValue(null);
    const res = await request(app).get('/api/seller-orders/999').set('x-test-role', 'Seller');
    expect(res.status).toBe(404);
  });

  test('POST /api/seller-orders returns 400 when missing fields', async () => {
    const res = await request(app).post('/api/seller-orders').set('x-test-role', 'Seller').send({});
    expect(res.status).toBe(400);
  });

  test('POST /api/seller-orders returns 404 when specialist missing', async () => {
    dbMock.Specialist.findByPk.mockResolvedValue(null);
    const payload = { specialist_id: 50, items: [{ inventory_id: 1, quantity: 1 }] };
    const res = await request(app).post('/api/seller-orders').set('x-test-role', 'Seller').send(payload);
    expect(res.status).toBe(404);
  });

  test('PUT /api/seller-orders/:id/cancel returns 404 when order not found', async () => {
    dbMock.SellerOrder.findByPk.mockResolvedValue(null);
    const res = await request(app).put('/api/seller-orders/10/cancel').set('x-test-role', 'Seller');
    expect(res.status).toBe(404);
  });

  test('GET /api/seller-orders/specialist/my-orders returns 404 when specialist profile missing', async () => {
    dbMock.Specialist.findOne.mockResolvedValue(null);
    const res = await request(app).get('/api/seller-orders/specialist/my-orders').set('x-test-role', 'Specialist');
    expect(res.status).toBe(404);
  });
});

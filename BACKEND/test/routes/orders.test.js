jest.mock('../../middleware/auth', () => ({
  isAuthenticated: (req, res, next) => {
    const headerId = req.headers['x-test-user-id'];
    req.user = { user_id: headerId ? Number(headerId) : 1, role: req.headers['x-test-role'] || 'Customer' };
    return next();
  }
}));

jest.mock('../../middleware/roles', () => ({
  isSeller: (req, res, next) => {
    const role = req.headers['x-test-role'] || req.user?.role || 'Seller';
    if (role !== 'Seller') return res.status(403).json({ error: 'Access denied. Seller only.' });
    return next();
  }
  ,
  isSpecialist: (req, res, next) => {
    const role = req.headers['x-test-role'] || req.user?.role || 'Seller';
    if (role !== 'Specialist') return res.status(403).json({ error: 'Access denied. Specialists only.' });
    return next();
  }
}));

jest.mock('../../models', () => ({
  Order: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn()
  },
  OrderItem: {
    create: jest.fn()
  },
  ShopInventory: {
    findByPk: jest.fn()
  },
  User: {},
  Sequelize: { Op: {} }
}));

const request = require('supertest');
const dbMock = require('../../models');
let app;

beforeAll(() => { app = require('../../server'); });
afterEach(() => jest.clearAllMocks());

describe('Orders routes', () => {
  test('GET /api/orders returns orders for seller', async () => {
    dbMock.Order.findAll.mockResolvedValue([{ order_id: 1 }]);
    const res = await request(app).get('/api/orders').set('x-test-role', 'Seller');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/orders/detail/:id 404 when not found', async () => {
    dbMock.Order.findByPk.mockResolvedValue(null);
    const res = await request(app).get('/api/orders/detail/999').set('x-test-role', 'Seller');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Order not found' });
  });

  test('PUT /api/orders/:id/accept returns 404 when order missing', async () => {
    dbMock.Order.findByPk.mockResolvedValue(null);
    const res = await request(app).put('/api/orders/5/accept').set('x-test-role', 'Seller');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Order not found' });
  });

  test('PUT /api/orders/:id/accept errors when insufficient stock', async () => {
    const order = { order_id: 2, status: 'Pending', OrderItems: [{ shop_inventory_id: 10, quantity: 5, ShopInventory: { quantity: 2 } }] };
    dbMock.Order.findByPk.mockResolvedValue(order);
    const res = await request(app).put('/api/orders/2/accept').set('x-test-role', 'Seller');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Insufficient stock to fulfill order');
  });

  test('PUT /api/orders/:id/decline cancels order', async () => {
    const order = { order_id: 3, status: 'Pending', save: jest.fn() };
    dbMock.Order.findByPk.mockResolvedValue(order);
    const res = await request(app).put('/api/orders/3/decline').set('x-test-role', 'Seller');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Order declined');
  });

  test('POST /api/orders fails when not customer', async () => {
    const res = await request(app).post('/api/orders').set('x-test-role', 'Seller').send({ items: [] });
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: 'Only customers can place orders' });
  });

  test('POST /api/orders fails when no items', async () => {
    const res = await request(app).post('/api/orders').set('x-test-role', 'Customer').send({ items: [] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Order must contain at least one item' });
  });

  test('POST /api/orders returns 404 when shop item missing', async () => {
    dbMock.ShopInventory.findByPk.mockResolvedValue(null);
    const payload = { items: [{ shop_inventory_id: 99, quantity: 1 }] };
    const res = await request(app).post('/api/orders').set('x-test-role', 'Customer').send(payload);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('PUT /api/orders/my-orders/:id/cancel returns 404 when order not found', async () => {
    dbMock.Order.findOne.mockResolvedValue(null);
    const res = await request(app).put('/api/orders/my-orders/50/cancel').set('x-test-role', 'Customer').send();
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Order not found' });
  });
});

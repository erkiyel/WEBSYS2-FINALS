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
  }
  ,
  isSpecialist: (req, res, next) => {
    const role = req.headers['x-test-role'] || req.user?.role || 'Seller';
    if (role !== 'Specialist') return res.status(403).json({ error: 'Access denied. Specialists only.' });
    return next();
  }
}));

jest.mock('../../models', () => ({
  ShopInventory: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    count: jest.fn(),
    sum: jest.fn()
  },
  Scroll: {},
  Specialist: {},
  Order: {},
  Sequelize: { Op: {} }
}));

const request = require('supertest');
const dbMock = require('../../models');
let app;

beforeAll(() => {
  app = require('../../server');
});

afterEach(() => jest.clearAllMocks());

describe('GET /api/shop-inventory', () => {
  test('returns inventory list for seller', async () => {
    dbMock.ShopInventory.findAll.mockResolvedValue([{ shop_inventory_id: 1, selling_price: '10.00' }]);
    const res = await request(app).get('/api/shop-inventory').set('x-test-role', 'Seller');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('PUT /api/shop-inventory/:id', () => {
  test('updates selling_price when positive', async () => {
    const item = { shop_inventory_id: 5, selling_price: '8.00', save: jest.fn(), shop_inventory_id: 5 };
    dbMock.ShopInventory.findByPk.mockResolvedValueOnce(item).mockResolvedValueOnce(item);

    const res = await request(app).put('/api/shop-inventory/5').set('x-test-role', 'Seller').send({ selling_price: 12.5 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Shop inventory updated');
    expect(item.save).toHaveBeenCalled();
  });

  test('returns 400 for non-positive price', async () => {
    dbMock.ShopInventory.findByPk.mockResolvedValue({ shop_inventory_id: 6, selling_price: '5.00', save: jest.fn() });
    const res = await request(app).put('/api/shop-inventory/6').set('x-test-role', 'Seller').send({ selling_price: 0 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Selling price must be positive' });
  });
});

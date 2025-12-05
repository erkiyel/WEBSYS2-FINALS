jest.mock('../../middleware/auth', () => ({
  isAuthenticated: (req, res, next) => {
    const headerId = req.headers['x-test-user-id'];
    req.user = { user_id: headerId ? Number(headerId) : 1, role: req.headers['x-test-role'] || 'Specialist' };
    return next();
  }
}));

jest.mock('../../middleware/roles', () => ({
  isSpecialist: (req, res, next) => {
    const role = req.headers['x-test-role'] || req.user?.role || 'Specialist';
    if (role !== 'Specialist') return res.status(403).json({ error: 'Access denied. Specialists only.' });
    return next();
  },
  isSeller: (req, res, next) => {
    const role = req.headers['x-test-role'] || req.user?.role || 'Seller';
    if (role !== 'Seller') return res.status(403).json({ error: 'Access denied. Seller only.' });
    return next();
  }
}));

jest.mock('../../models', () => ({
  Specialist: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn()
  },
  SpecialistInventory: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  },
  Scroll: {
    findByPk: jest.fn()
  },
  Element: {},
  User: {},
  Sequelize: { Op: {} },
  sequelize: { Sequelize: { Op: { gt: Symbol('gt'), lt: Symbol('lt'), gte: Symbol('gte'), lte: Symbol('lte') } } }
}));

const request = require('supertest');
const dbMock = require('../../models');
let app;

beforeAll(() => { app = require('../../server'); });
afterEach(() => jest.clearAllMocks());

describe('Specialists routes', () => {
  test('GET /api/specialists returns list', async () => {
    dbMock.Specialist.findAll.mockResolvedValue([{ specialist_id: 1, shop_name: 'Bob\'s Shop' }]);
    const res = await request(app).get('/api/specialists');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/specialists/:id returns 404 when not found', async () => {
    dbMock.Specialist.findByPk.mockResolvedValue(null);
    const res = await request(app).get('/api/specialists/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Specialist not found' });
  });

  test('GET /api/specialists/:id/inventory returns inventory', async () => {
    dbMock.SpecialistInventory.findAll.mockResolvedValue([{ inventory_id: 1 }]);
    const res = await request(app).get('/api/specialists/1/inventory');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/specialists/me/profile returns 404 when profile not found', async () => {
    dbMock.Specialist.findOne.mockResolvedValue(null);
    const res = await request(app).get('/api/specialists/me/profile').set('x-test-role', 'Specialist');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Specialist profile not found' });
  });

  test('POST /api/specialists/me/inventory returns 400 for missing fields', async () => {
    const res = await request(app).post('/api/specialists/me/inventory').set('x-test-role', 'Specialist').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/specialists/me/inventory success path', async () => {
    const specialist = { specialist_id: 2, user_id: 2 };
    const scroll = { scroll_id: 5 };
    const created = { inventory_id: 42 };
    const completeItem = { inventory_id: 42, Scroll: { scroll_id: 5 } };

    dbMock.Specialist.findOne.mockResolvedValue(specialist);
    dbMock.Scroll.findByPk.mockResolvedValue(scroll);
    dbMock.SpecialistInventory.findOne.mockResolvedValue(null);
    dbMock.SpecialistInventory.create.mockResolvedValue(created);
    dbMock.SpecialistInventory.findByPk.mockResolvedValue(completeItem);

    const payload = { scroll_id: 5, stock_quantity: 10, source_price: '2.00', quality_rating: 4.5 };
    const res = await request(app).post('/api/specialists/me/inventory').set('x-test-role', 'Specialist').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Scroll added to inventory');
    expect(res.body.item).toEqual(completeItem);
  });
});

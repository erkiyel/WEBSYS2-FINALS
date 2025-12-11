jest.mock('../../models', () => ({
  Scroll: {
    findAll: jest.fn(),
    findByPk: jest.fn()
  },
  Element: {}
}));

const request = require('supertest');
const dbMock = require('../../models');
let app;

beforeAll(() => {
  app = require('../../server');
});

afterEach(() => jest.clearAllMocks());

describe('GET /api/scrolls', () => {
  test('returns list of scrolls', async () => {
    dbMock.Scroll.findAll.mockResolvedValue([{ scroll_id: 1, scroll_name: 'Wind Bolt' }]);
    const res = await request(app).get('/api/scrolls');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('scroll_name', 'Wind Bolt');
  });
});

describe('GET /api/scrolls/:id', () => {
  test('returns 404 when not found', async () => {
    dbMock.Scroll.findByPk.mockResolvedValue(null);
    const res = await request(app).get('/api/scrolls/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Scroll not found' });
  });

  test('returns scroll when found', async () => {
    dbMock.Scroll.findByPk.mockResolvedValue({ scroll_id: 2, scroll_name: 'Fireball' });
    const res = await request(app).get('/api/scrolls/2');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('scroll_name', 'Fireball');
  });
});

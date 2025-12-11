const request = require('supertest');
const app = require('../../server');

describe('GET /', () => {
  test('responds with welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Magical Scroll Shop API' });
  });
});

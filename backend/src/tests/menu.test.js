const request = require('supertest');
const app = require('../app');

describe('Menu API', () => {
  it('should fetch menu items', async () => {
    const res = await request(app).get('/api/menu');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

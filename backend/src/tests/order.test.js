const request = require('supertest');
const app = require('../app');

describe('Order API', () => {
  let orderId;

  it('should create an order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        customer: {
          name: 'Nilesh',
          address: 'Pune',
          phone: '9999999999'
        },
        items: [
          { id: 1, quantity: 2 }
        ]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.orderId).toBeDefined();

    orderId = res.body.orderId;
  });

  it('should fetch order by id', async () => {
    const res = await request(app).get(`/api/orders/${orderId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(orderId);
  });

  it('should return error for invalid order', async () => {
    const res = await request(app).get('/api/orders/invalid-id');

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

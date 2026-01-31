const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');
const validateOrder = require('../middleware/validation.middleware');
const { getOrderById } = require('../models/order.model');


router.get('/history', orderController.getOrderHistory);
router.post('/:id/reorder', orderController.reorderOrder);


router.put('/:id/cancel', orderController.cancelOrderById);


/**
 * Create a new order
 * POST /api/orders
 */
router.post('/', validateOrder, orderController.createOrder);

/**
 * Get order by ID (normal REST)
 * GET /api/orders/:id
 */
router.get('/:id', orderController.getOrderById);

/**
 * 🔴 REAL-TIME ORDER STATUS (SSE)
 * GET /api/orders/:id/stream
 */
router.get('/:id/stream', async (req, res) => {
  const orderId = req.params.id;

  // Required headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial data immediately
  const sendUpdate = async () => {
    const order = await getOrderById(orderId);
    if (order) {
      res.write(`data: ${JSON.stringify(order)}\n\n`);
    }
  };

  // First push
  await sendUpdate();

  // Push updates every 3 seconds
  const interval = setInterval(sendUpdate, 3000);

  // Cleanup when client disconnects
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

module.exports = router;

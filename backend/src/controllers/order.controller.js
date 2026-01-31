const orderModel = require('../models/order.model');
const { clearOrderTimers } = require('../services/orderStatus.service');

/**
 * Create order
 */
const createOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

const result = await orderModel.createOrder(
  customer,
  items,
  totalAmount
);


    res.status(201).json({
      success: true,
      orderId: result.orderId,
      status: result.status,
      totalAmount: result.totalAmount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order' });
  }
};

/**
 * Get order
 */
const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch {
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

/**
 * Cancel order
 */
const cancelOrderById = async (req, res) => {
  try {
    const result = await orderModel.cancelOrder(req.params.id);

    if (!result.success) {
      return res.status(400).json({
        message:
          result.reason === 'TOO_LATE'
            ? 'Order cannot be cancelled now'
            : 'Order not found'
      });
    }

    clearOrderTimers(req.params.id);

    res.json({ message: 'Order cancelled successfully' });
  } catch {
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};

/**
 * Order history
 */
const getOrderHistory = async (req, res) => {
  const orders = await orderModel.getOrderHistory();
  res.json({ success: true, data: orders });
};

/**
 * Reorder
 */
const reorderOrder = async (req, res) => {
  const items = await orderModel.getOrderItems(req.params.id);
  res.json({ success: true, items });
};

module.exports = {
  createOrder,
  getOrderById,
  cancelOrderById,
  getOrderHistory,
  reorderOrder
};

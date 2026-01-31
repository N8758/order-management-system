const db = require('../config/database');

const STATUSES = [
  'Order Received',
  'Preparing',
  'Out for Delivery',
  'Delivered'
];

// 🔴 store timers per order
const orderTimers = {};

const startOrderStatusFlow = (orderId) => {
  orderTimers[orderId] = [];

  STATUSES.forEach((status, index) => {
    const timer = setTimeout(() => {
      // 🔴 check current status before updating
      db.get(
        `SELECT status FROM orders WHERE id = ?`,
        [orderId],
        (err, row) => {
          if (err || !row) return;

          // ❌ STOP if cancelled
          if (row.status === 'Cancelled') {
            clearOrderTimers(orderId);
            return;
          }

          db.run(
            `UPDATE orders SET status = ? WHERE id = ?`,
            [status, orderId],
            (err) => {
              if (err) {
                console.error('❌ Status update failed:', err);
              } else {
                console.log(`✅ Order ${orderId} → ${status}`);
              }
            }
          );
        }
      );
    }, (index + 1) * 7000);

    orderTimers[orderId].push(timer);
  });
};

// 🔴 stop all timers for an order
const clearOrderTimers = (orderId) => {
  if (orderTimers[orderId]) {
    orderTimers[orderId].forEach(clearTimeout);
    delete orderTimers[orderId];
    console.log(`⛔ Timers stopped for order ${orderId}`);
  }
};

module.exports = {
  startOrderStatusFlow,
  clearOrderTimers
};

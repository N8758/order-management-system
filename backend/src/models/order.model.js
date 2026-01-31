const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { startOrderStatusFlow } = require('../services/orderStatus.service');

/**
 * 🔹 Calculate total amount from DB (SAFE)
 */
const calculateTotalAmount = (items) => {
  return new Promise((resolve, reject) => {
    let total = 0;
    let pending = items.length;

    if (pending === 0) return resolve(0);

    items.forEach(item => {
      db.get(
        `SELECT price FROM menu_items WHERE id = ?`,
        [item.id],
        (err, row) => {
          if (err || !row) {
            reject(new Error('Invalid menu item'));
            return;
          }

          total += row.price * item.quantity;
          pending--;

          if (pending === 0) {
            resolve(total);
          }
        }
      );
    });
  });
};

/**
 * 🔹 Create Order
 */
const createOrder = async (customer, items) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orderId = uuidv4();
      const status = 'Order Received';

      // ✅ Calculate total safely
      const totalAmount = await calculateTotalAmount(items);

      db.serialize(() => {
        // INSERT ORDER
        db.run(
          `INSERT INTO orders 
           (id, name, address, phone, email, status, total_amount)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            customer.name,
            customer.address,
            customer.phone,
            customer.email,
            status,
            totalAmount
          ],
          (err) => {
            if (err) return reject(err);
          }
        );

        // INSERT ORDER ITEMS
        const stmt = db.prepare(
          `INSERT INTO order_items (order_id, item_id, quantity)
           VALUES (?, ?, ?)`
        );

        items.forEach(item => {
          stmt.run(orderId, item.id, item.quantity);
        });

        stmt.finalize(err => {
          if (err) return reject(err);

          // 🔴 Start status simulation
          startOrderStatusFlow(orderId);

          resolve({
            orderId,
            status,
            totalAmount
          });
        });
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 🔹 Get Order By ID
 */
const getOrderById = (orderId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM orders WHERE id = ?`,
      [orderId],
      (err, order) => {
        if (err) return reject(err);
        if (!order) return resolve(null);

        db.all(
          `SELECT * FROM order_items WHERE order_id = ?`,
          [orderId],
          (err, items) => {
            if (err) return reject(err);
            resolve({ ...order, items });
          }
        );
      }
    );
  });
};

/**
 * 🔹 Order History
 */
const getOrderHistory = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM orders ORDER BY created_at DESC`,
      [],
      (err, orders) => {
        if (err) return reject(err);
        resolve(orders);
      }
    );
  });
};

/**
 * 🔹 Reorder Items
 */
const getOrderItems = (orderId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT mi.*, oi.quantity
      FROM order_items oi
      JOIN menu_items mi ON mi.id = oi.item_id
      WHERE oi.order_id = ?
      `,
      [orderId],
      (err, items) => {
        if (err) return reject(err);
        resolve(items);
      }
    );
  });
};

/**
 * 🔹 Cancel Order
 */
const cancelOrder = (orderId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT status FROM orders WHERE id = ?`,
      [orderId],
      (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve({ success: false, reason: 'NOT_FOUND' });

        if (
          row.status === 'Out for Delivery' ||
          row.status === 'Delivered'
        ) {
          return resolve({ success: false, reason: 'TOO_LATE' });
        }

        db.run(
          `UPDATE orders SET status = ? WHERE id = ?`,
          ['Cancelled', orderId],
          () => resolve({ success: true })
        );
      }
    );
  });
};

/**
 * ✅ EXPORTS
 */
module.exports = {
  createOrder,
  getOrderById,
  getOrderHistory,
  getOrderItems,
  cancelOrder
};

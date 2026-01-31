const db = require('../config/database');

/**
 * Get all menu items
 */
const getAllMenuItems = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM menu_items`;

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  getAllMenuItems
};

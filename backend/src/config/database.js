const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database folder exists
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'order_management.db');

const db = new sqlite3.Database(dbPath, () => {
  console.log('SQLite database connected');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL
    )
  `);

    // ✅ ORDERS TABLE (REQUIRED)
 db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);


  // ✅ ORDER ITEMS TABLE (REQUIRED)
  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `);


  db.get(`SELECT COUNT(*) as count FROM menu_items`, (err, row) => {
    if (row.count !== 0) return;

    const stmt = db.prepare(`
      INSERT INTO menu_items (name, description, price, image, category)
      VALUES (?, ?, ?, ?, ?)
    `);

    /* ===================== 🍕 PIZZA (10) ===================== */
    const pizzas = [
      // ['Margherita Pizza', 'Classic cheese & tomato pizza',
      //   'https://images.unsplash.com/photo-1601924638867-3ec4f1c7b7c3'],
      // ['Pepperoni Pizza', 'Loaded with spicy pepperoni',
      //   'https://images.unsplash.com/photo-1548365328-8b849e6c7b1a'],
      ['Farmhouse Pizza', 'Veggies with farmhouse flavors',
        'https://images.unsplash.com/photo-1594007654729-407eedc4be65'],
      ['BBQ Chicken Pizza', 'Smoky BBQ chicken topping',
        'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3'],
      ['Paneer Tikka Pizza', 'Indian paneer tikka twist',
        'https://images.unsplash.com/photo-1628840042765-356cda07504e'],
      ['Cheese Burst Pizza', 'Extra cheese inside the crust',
        'https://images.unsplash.com/photo-1604917877934-07d8d248d396'],
      ['Mushroom Pizza', 'Mushrooms with mozzarella',
        'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e'],
      // ['Four Cheese Pizza', 'Blend of four premium cheeses',
      //   'https://images.unsplash.com/photo-1603079841741-74e2d4f0b8dd'],
      ['Mexican Green Wave', 'Spicy Mexican style pizza',
        'https://images.unsplash.com/photo-1598023696416-0193a0bcd302'],
      // ['Classic Veg Pizza', 'Simple and tasty veg pizza',
      //   'https://images.unsplash.com/photo-1605475128023-6eaf1c01e6c7']
    ];

    /* ===================== 🍔 BURGERS (10) ===================== */
    const burgers = [
      ['Classic Veg Burger', 'Crispy veg patty with mayo',
        'https://images.unsplash.com/photo-1550547660-d9450f859349'],
      ['Cheese Burger', 'Cheesy and juicy burger',
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'],
      // ['Spicy Veg Burger', 'Hot and spicy veg burger',
      //   'https://images.unsplash.com/photo-1606755962773-0c3e3a9bfa44'],
      ['Aloo Tikki Burger', 'Indian aloo tikki flavor',
        'https://images.unsplash.com/photo-1586190848861-99aa4a171e90'],
      ['Crispy Chicken Burger', 'Crunchy fried chicken burger',
        'https://images.unsplash.com/photo-1550317138-10000687a72b'],
      ['Grilled Chicken Burger', 'Healthy grilled chicken patty',
        'https://images.unsplash.com/photo-1603064752734-4c48eff53d05'],
      // ['Paneer Burger', 'Soft paneer patty burger',
      //   'https://images.unsplash.com/photo-1626082929543-5bab0c72e53f'],
      ['BBQ Chicken Burger', 'BBQ sauce chicken burger',
        'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5'],
      ['Double Patty Burger', 'Extra filling double patty',
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add'],
      ['House Special Burger', 'Chef’s special burger',
        'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6']
    ];

    /* ===================== 🥤 DRINKS (10) ===================== */
    const drinks = [
      ['Coca Cola', 'Chilled classic coke',
        'https://images.unsplash.com/photo-1629203851122-3726ecdf080e'],
      ['Cold Coffee', 'Smooth cold coffee',
        'https://images.unsplash.com/photo-1511920170033-f8396924c348'],
      ['Chocolate Milkshake', 'Rich chocolate shake',
        'https://images.unsplash.com/photo-1577805947697-89e18249d767'],
      // ['Vanilla Milkshake', 'Creamy vanilla shake',
      //   'https://images.unsplash.com/photo-1542444459-db47c9d44c0a'],
      // ['Strawberry Shake', 'Fresh strawberry flavor',
      //   'https://images.unsplash.com/photo-1589712235274-9b9a7fa7e4a1'],
      // ['Mint Mojito', 'Refreshing mint drink',
      //   'https://images.unsplash.com/photo-1582450721226-20a1b69c1bb8'],
      ['Blue Lagoon', 'Cool blue mocktail',
        'https://images.unsplash.com/photo-1546171753-97d7676e4602'],
      ['Orange Juice', 'Fresh orange juice',
        'https://images.unsplash.com/photo-1571687949921-1306bfb24b72'],
      ['Watermelon Juice', 'Hydrating watermelon drink',
        'https://images.unsplash.com/photo-1622597467836-f3285f2131b8'],
      ['Sweet Lassi', 'Traditional sweet lassi',
        'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f']
    ];

    /* ===================== 🍰 DESSERTS (10) ===================== */
    const desserts = [
      ['Chocolate Brownie', 'Warm chocolate brownie',
        'https://images.unsplash.com/photo-1606313564200-e75d5e30476c'],
      ['Vanilla Ice Cream', 'Classic vanilla scoop',
        'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f'],
      ['Chocolate Ice Cream', 'Rich chocolate ice cream',
        'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb'],
      ['Strawberry Ice Cream', 'Strawberry delight',
        'https://images.unsplash.com/photo-1624353365286-3f8d62daad51'],
      ['Gulab Jamun', 'Soft syrupy gulab jamun',
        'https://images.unsplash.com/photo-1601050690597-df0568f70950'],
      // ['Rasgulla', 'Spongy Bengali sweet',
      //   'https://images.unsplash.com/photo-1608219959302-8b9f3e39e9e3'],
      // ['Cheesecake', 'Creamy baked cheesecake',
      //   'https://images.unsplash.com/photo-1542826438-8b4a4a2f1f5a'],
      // ['Red Velvet Cake', 'Soft red velvet cake',
      //   'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b9'],
      ['Donut', 'Glazed sweet donut',
        'https://images.unsplash.com/photo-1551024601-bec78aea704b'],
      ['Waffle', 'Crispy Belgian waffle',
        'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0']
    ];

    const insertAll = (items, category) => {
      items.forEach((i, index) => {
        stmt.run(
          i[0],
          i[1],
          120 + index * 10,
          i[2],
          category
        );
      });
    };

    insertAll(pizzas, 'Pizza');
    insertAll(burgers, 'Burgers');
    insertAll(drinks, 'Drinks');
    insertAll(desserts, 'Desserts');

    stmt.finalize();
    console.log('✅ 40 menu items seeded (10 per category)');
  });
});

module.exports = db;

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize DB
require('./config/database');

// Routes
const menuRoutes = require('./routes/menu.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Order Management API is running'
  });
});

module.exports = app;

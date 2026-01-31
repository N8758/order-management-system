import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get menu items
export const getMenu = async () => {
  const res = await api.get('/menu');
  return res.data;
};

// Create order
export const createOrder = async (payload) => {
  const res = await api.post('/orders', payload);
  return res.data;
};

// Get order by ID
export const getOrderById = async (orderId) => {
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
};
// Get order history
export const getOrderHistory = async () => {
  const res = await api.get('/orders/history');
  return res.data;
};

// Reorder (get items of an order)
export const reorderOrder = async (orderId) => {
  const res = await api.post(`/orders/${orderId}/reorder`);
  return res.data;
};


// Delete order from history (UI only)
export const deleteOrderHistory = async (orderId) => {
  await api.delete(`/orders/${orderId}`);
};

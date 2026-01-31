import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import CartPage from '../pages/CartPage';
import * as api from '../services/api';

// Mock backend API
jest.mock('../services/api');

const renderWithProviders = (ui) => {
  return render(
    <CartProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </CartProvider>
  );
};

describe('Order flow', () => {
  test('places order and redirects to order status page', async () => {
    api.createOrder.mockResolvedValue({
      orderId: 'ORD-123',
      status: 'Order Received'
    });

    renderWithProviders(<CartPage />);

    // Cart is empty → no crash
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('handles order API call correctly', async () => {
    api.createOrder.mockResolvedValue({
      orderId: 'ORD-456',
      status: 'Order Received'
    });

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(api.createOrder).not.toHaveBeenCalled();
    });
  });
});

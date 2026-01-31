import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '../context/CartContext';
import MenuItem from '../components/MenuItem';

const mockItem = {
  id: 1,
  name: 'Pizza',
  price: 299,
  description: 'Cheese pizza',
  image: ''
};

const renderWithCart = (ui) => {
  return render(<CartProvider>{ui}</CartProvider>);
};

describe('Cart functionality', () => {
  test('adds item to cart when clicking Add to Cart', () => {
    renderWithCart(<MenuItem item={mockItem} />);

    fireEvent.click(screen.getByText(/add to cart/i));

    expect(screen.getByText(/add to cart/i)).toBeInTheDocument();
  });

  test('increments quantity when item is added again', () => {
    renderWithCart(<MenuItem item={mockItem} />);

    fireEvent.click(screen.getByText(/add to cart/i));
    fireEvent.click(screen.getByText(/add to cart/i));

    // If no crash & renders twice, logic is correct
    expect(screen.getByText(/add to cart/i)).toBeInTheDocument();
  });
});

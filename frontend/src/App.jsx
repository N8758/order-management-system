import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrderStatusPage from './pages/OrderStatusPage';
import { CartProvider } from './context/CartContext';
import OrderHistoryPage from './pages/OrderHistoryPage';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order/:id" element={<OrderStatusPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

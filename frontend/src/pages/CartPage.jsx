import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';

const CartPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  // 🔹 Customer details state
  const [customer, setCustomer] = useState({
    name: '',
    phone: '+91',
    email: '',
    address: ''
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 🔒 VALIDATION FUNCTION
  const validateForm = () => {
    // Name: letters & spaces only
    const nameRegex = /^[A-Za-z ]+$/;
    if (!nameRegex.test(customer.name.trim())) {
      alert('Name should contain only letters');
      return false;
    }

    // Phone: +91 followed by 10 digits
    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneRegex.test(customer.phone)) {
      alert('Phone must be in format +91XXXXXXXXXX');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      alert('Enter a valid email address');
      return false;
    }

    // Address minimum length
    if (customer.address.trim().length < 10) {
      alert('Address must be at least 10 characters');
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!validateForm()) return;

    const payload = {
  customer,
  items: cart.map(item => ({
    id: item.id,
    quantity: item.quantity
  })),
  totalAmount: total
};


    try {
      const res = await createOrder(payload);
      navigate(`/order/${res.orderId}`);
    } catch (err) {
      console.error('Order failed', err);
      alert('Failed to place order');
    }
  };

  return (
    <div className="container">
      <h1>🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {/* Cart items */}
          {cart.map(item => (
            <CartItem key={item.id} item={item} />
          ))}

          {/* Customer details form */}
          <div className="checkout-form">
            <h3>Delivery Details</h3>

            <input
              type="text"
              placeholder="Full Name"
              value={customer.name}
              onChange={e =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="+91XXXXXXXXXX"
              value={customer.phone}
              onChange={e =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email Address"
              value={customer.email}
              onChange={e =>
                setCustomer({ ...customer, email: e.target.value })
              }
            />

            <textarea
              placeholder="Delivery Address"
              value={customer.address}
              onChange={e =>
                setCustomer({ ...customer, address: e.target.value })
              }
            />
          </div>

          {/* Total */}
          <h3>Total: ₹{total}</h3>

          {/* Place order */}
          <button className="btn" onClick={handleCheckout}>
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;

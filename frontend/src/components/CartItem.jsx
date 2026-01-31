import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <div>
        <h4>{item.name}</h4>
        <p>₹{item.price} × {item.quantity}</p>
      </div>

      <div className="cart-actions">
        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
          −
        </button>

        <span>{item.quantity}</span>

        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
          +
        </button>

        <button
          className="remove"
          onClick={() => removeFromCart(item.id)}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CartItem;

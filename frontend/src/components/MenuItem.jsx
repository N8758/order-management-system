import { memo } from 'react';
import { useCart } from '../context/CartContext';

const MenuItem = memo(({ item }) => {
  const { cart, addToCart, removeFromCart } = useCart();

  const cartItem = cart.find(i => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="card">
      <img
        src={item.image}
        alt={item.name}
        className="card-img"
        loading="lazy"          // 🔥 BIG PERFORMANCE BOOST
        decoding="async"
        onError={(e) => {
          e.target.src = '/fallback-food.jpg';
        }}
      />

      <div className="card-body">
        <h3>{item.name}</h3>
        <p className="desc">{item.description}</p>
        <p className="price">₹{item.price}</p>

        {quantity === 0 ? (
          <button className="btn" onClick={() => addToCart(item)}>
            Add to Cart
          </button>
        ) : (
          <div className="qty-controls">
            <button onClick={() => removeFromCart(item.id)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => addToCart(item)}>+</button>
          </div>
        )}
      </div>
    </div>
  );
});

export default MenuItem;

import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  // REORDER: add items from history into cart
const reorderItems = (items) => {
  setCart(prev => {
    const updated = [...prev];

    items.forEach(item => {
      const existing = updated.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        updated.push({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity
        });
      }
    });

    return updated;
  });
};

  const [cart, setCart] = useState([]);


  // ADD or INCREASE
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // DECREASE by 1 (remove only if qty = 0)
  const removeFromCart = (id) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // SET quantity directly
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // REMOVE item completely
  const deleteFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
  value={{
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    deleteFromCart,
    clearCart,
    reorderItems
  }}
>

      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

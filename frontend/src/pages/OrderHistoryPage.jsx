import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getOrderHistory, reorderOrder } from '../services/api';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const { reorderItems } = useCart();

  // ✅ Hook MUST be inside component
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const res = await getOrderHistory();
    setOrders(res.data);
  };

  const handleReorder = async (orderId) => {
    const res = await reorderOrder(orderId);

    // ✅ correct response shape
   reorderItems(res.items);

    // ✅ now user can SEE cart
    navigate('/cart');
  };

  const handleDelete = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <div className="container">
      <h1>📜 Order History</h1>

      {orders.length === 0 ? (
        <p>No past orders</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="history-card">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Date:</strong> {order.created_at}</p>

            <div className="actions">
              <button className="btn" onClick={() => handleReorder(order.id)}>
                Reorder
              </button>

              <button
                className="btn danger"
                onClick={() => handleDelete(order.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistoryPage;

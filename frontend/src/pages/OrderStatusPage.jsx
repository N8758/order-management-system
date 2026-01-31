import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/OrderStatusPage.css';

const OrderStatusPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost:5000/api/orders/${id}/stream`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setOrder(data);
      updateMessage(data.status);
    };

    eventSource.onerror = () => eventSource.close();

    return () => eventSource.close();
  }, [id]);

  const updateMessage = (status) => {
    if (status === 'Order Received') {
      setMessage('✅ You can cancel your order now.');
    } else if (status === 'Preparing') {
      setMessage('⚠️ Cancel quickly before delivery starts.');
    } else if (status === 'Out for Delivery') {
      setMessage('❌ Order is on the way. Cancellation not possible.');
    } else if (status === 'Delivered') {
      setMessage('📦 Order delivered successfully.');
    } else if (status === 'Cancelled') {
      setMessage('❌ This order has been cancelled.');
    }
  };

  const handleCancel = async () => {
    const confirmCancel = window.confirm(
      'Are you sure?\nYou can cancel only before the order is out for delivery.'
    );

    if (!confirmCancel) return;

    const res = await fetch(
      `http://localhost:5000/api/orders/${order.id}/cancel`,
      { method: 'PUT' }
    );

    const data = await res.json();
    alert(data.message || 'Order cancelled');
  };

  if (!order) {
    return <p className="center">Loading order status...</p>;
  }

  const statusClass = `status-${order.status
    .toLowerCase()
    .replaceAll(' ', '-')}`;

  const canCancel =
    order.status === 'Order Received' ||
    order.status === 'Preparing';

  return (
    <div className="order-wrapper">
      <div className="order-card">
        <h1>📦 Order Status</h1>

        <span className={`status-badge ${statusClass}`}>
          {order.status}
        </span>

        <p className="status-message">{message}</p>

        <div className="order-info">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Customer:</strong> {order.name}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Total Amount:</strong> ₹{order.total_amount}</p>
        </div>

        {canCancel ? (
          <button className="btn danger" onClick={handleCancel}>
            Cancel Order
          </button>
        ) : (
          <button className="btn disabled" disabled>
            Cancellation Not Available
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderStatusPage;

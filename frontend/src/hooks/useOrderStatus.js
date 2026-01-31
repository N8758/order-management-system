import { useEffect, useState } from 'react';
import { getOrderById } from '../services/api';

const useOrderStatus = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order status', err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    const interval = setInterval(fetchOrder, 5000); // poll every 5 sec

    return () => clearInterval(interval);
  }, [orderId]);

  return { order, loading };
};

export default useOrderStatus;

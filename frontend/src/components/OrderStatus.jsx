const STATUS_STEPS = [
  'Order Received',
  'Preparing',
  'Out for Delivery',
  'Delivered'
];

const OrderStatus = ({ status }) => {
  return (
    <div className="status-container">
      {STATUS_STEPS.map(step => (
        <div
          key={step}
          className={`status-step ${
            STATUS_STEPS.indexOf(step) <= STATUS_STEPS.indexOf(status)
              ? 'active'
              : ''
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;

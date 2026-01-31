/**
 * Validate order creation request
 */
const validateOrder = (req, res, next) => {
  const { customer, items } = req.body;

  if (!customer || !customer.name || !customer.address || !customer.phone) {
    return res.status(400).json({
      success: false,
      message: 'Customer name, address, and phone are required'
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Order items cannot be empty'
    });
  }

  for (const item of items) {
    if (!item.id || !item.quantity || item.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Each item must have valid id and quantity'
      });
    }
  }

  next();
};

module.exports = validateOrder;

/**
 * Standard success response
 */
const successResponse = (res, data, message = 'Success', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

/**
 * Standard error response
 */
const errorResponse = (res, message = 'Error', status = 500) => {
  return res.status(status).json({
    success: false,
    message
  });
};

module.exports = {
  successResponse,
  errorResponse
};

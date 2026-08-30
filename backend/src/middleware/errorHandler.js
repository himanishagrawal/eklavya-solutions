const { failure } = require('../utils/apiResponse');

// Centralized error handler. Every controller should forward
// errors here via next(err) instead of building its own response.
function notFoundHandler(req, res) {
  return failure(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.expose ? err.message : (status < 500 ? err.message : 'Internal server error');

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error('[error]', err);
  }

  return failure(res, message || 'Something went wrong', status, err.details || null);
}

module.exports = { notFoundHandler, errorHandler };

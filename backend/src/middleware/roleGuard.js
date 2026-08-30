// Restricts a route to one or more roles. Must run after requireAuth.
function roleGuard(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const err = new Error('You do not have permission to access this resource');
      err.status = 403;
      err.expose = true;
      return next(err);
    }
    return next();
  };
}

module.exports = { roleGuard };

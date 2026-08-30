const { verifyAccessToken } = require('../utils/jwt');

// Protects a route: requires a valid Bearer access token.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    const err = new Error('Authentication required');
    err.status = 401;
    err.expose = true;
    return next(err);
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload; // { sub, email, role }
    return next();
  } catch (e) {
    const err = new Error('Invalid or expired session');
    err.status = 401;
    err.expose = true;
    return next(err);
  }
}

module.exports = { requireAuth };

/**
 * middleware/auth.js
 * JWT authentication + role-based authorisation
 */
const jwt    = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'homeoassist_secret';

/** Verify token and attach decoded payload to req.user */
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ success: false, error: 'No token provided' });

  try {
    req.user = jwt.verify(header.split(' ')[1], SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

/** Restrict to specific roles — usage: authorize('admin') */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ success: false, error: 'Forbidden: insufficient role' });
    next();
  };
}

module.exports = { authenticate, authorize };

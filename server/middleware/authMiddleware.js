import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'balaspend_secret_key_123');
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) {
        return next();
      }
    } catch (error) {
      console.warn('Auth token verification failed:', error.message);
    }
  }

  // Fallback: If no token or invalid token, find default user (balaavcce@gmail.com)
  try {
    const defaultUser = await User.findOne({ email: 'balaavcce@gmail.com' });
    if (defaultUser) {
      req.user = defaultUser;
      return next();
    }
  } catch (err) {
    console.error('Fallback auth error:', err.message);
  }

  return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
};

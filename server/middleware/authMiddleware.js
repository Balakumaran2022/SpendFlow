import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getUserModelForUri } from '../config/multiDb.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'balaspend_secret_key_123');

      // 1. Get mongoUri from JWT payload (set during login/register)
      const mongoUri = decoded.mongoUri || '';

      // 2. Look up user in their own DB (custom or master)
      const TargetUserModel = await getUserModelForUri(mongoUri);
      let user = await TargetUserModel.findById(decoded.id).select('-password');

      // 3. Fallback to master DB if not found in custom DB
      if (!user) {
        user = await User.findById(decoded.id).select('-password');
      }

      if (user) {
        // Attach mongoUri from JWT so expenseController uses correct DB
        req.user = user;
        req.user.mongoUri = mongoUri || user.mongoUri || '';
        return next();
      }
    } catch (error) {
      console.warn('Auth token verification failed:', error.message);
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
};

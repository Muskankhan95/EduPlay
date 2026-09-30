import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { User } from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token missing or invalid',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await User.findOne({
      $or: [
        { id: decoded.id },
        ...(decoded.email ? [{ email: decoded.email.toLowerCase() }] : []),
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User associated with token not found',
      });
    }

    const userObj = user.toObject();
    const { passwordHash, ...safeUser } = userObj;
    req.user = safeUser;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

// Allows authenticated users or gracefully defaults to demo user for simple frontend queries
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findOne({
        $or: [
          { id: decoded.id },
          ...(decoded.email ? [{ email: decoded.email.toLowerCase() }] : []),
        ],
      });
      if (user) {
        const userObj = user.toObject();
        const { passwordHash, ...safeUser } = userObj;
        req.user = safeUser;
        return next();
      }
    }
  } catch (err) {
    // Silently fall through to fallback demo user
  }

  // Fallback to default demo user Alex Morgan for convenience in dev
  const demoUser = await User.findOne({ id: 'usr_101' });
  if (demoUser) {
    const demoObj = demoUser.toObject();
    const { passwordHash, ...safeUser } = demoObj;
    req.user = safeUser;
  }
  next();
};

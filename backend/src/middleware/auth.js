import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { db } from '../db/jsonDb.js';

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

    const user = await db.findById('users', decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User associated with token not found',
      });
    }

    const { passwordHash, ...safeUser } = user;
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
      const user = await db.findById('users', decoded.id);
      if (user) {
        const { passwordHash, ...safeUser } = user;
        req.user = safeUser;
        return next();
      }
    }
  } catch (err) {
    // Silently fall through to fallback demo user
  }

  // Fallback to default demo user Alex Morgan for convenience in dev
  const demoUser = await db.findById('users', 'usr_101');
  if (demoUser) {
    const { passwordHash, ...safeUser } = demoUser;
    req.user = safeUser;
  }
  next();
};

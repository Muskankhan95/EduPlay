import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'eduplay_super_secret_jwt_key_2026_gamified_learning',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

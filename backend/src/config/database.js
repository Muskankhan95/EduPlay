import mongoose from 'mongoose';
import { config } from './index.js';

export const connectDB = async () => {
  const mongoUri = config.mongoUri || process.env.MONGO_URI;

  if (!mongoUri) {
    const errorMsg = '❌ FATAL: MONGO_URI environment variable is not defined in backend/.env';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

export const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

export const getDatabaseState = () => {
  switch (mongoose.connection.readyState) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'unknown';
  }
};

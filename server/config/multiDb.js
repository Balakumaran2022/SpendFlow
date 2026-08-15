import mongoose from 'mongoose';
import User from '../models/User.js';
import Expense from '../models/Expense.js';

const connectionMap = new Map();

// Strict MongoDB Atlas Connection URL Regex
export const MONGO_ATLAS_REGEX = /^mongodb(\+srv)?:\/\/[^\s:]+:[^\s@]+@[^\s\/]+(\/[^\s?]*)?(\?.*)?$/;

/**
 * Get or establish Mongoose connection for a given MongoDB URI
 */
export const getCustomConnection = async (mongoUri) => {
  if (!mongoUri || typeof mongoUri !== 'string') return null;
  const uri = mongoUri.trim();

  if (connectionMap.has(uri)) {
    const conn = connectionMap.get(uri);
    if (conn.readyState === 1) return conn;
  }

  try {
    const conn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    }).asPromise();

    connectionMap.set(uri, conn);
    return conn;
  } catch (err) {
    console.error(`Failed to connect to custom MongoDB Atlas (${uri}):`, err.message);
    return null;
  }
};

/**
 * Test a MongoDB connection URL to verify if it connects successfully
 */
export const testMongoConnection = async (mongoUri) => {
  if (!mongoUri || typeof mongoUri !== 'string') {
    throw new Error('Please provide a valid MongoDB Atlas connection string');
  }

  const trimmedUri = mongoUri.trim();
  
  if (!MONGO_ATLAS_REGEX.test(trimmedUri)) {
    throw new Error('Invalid MongoDB Atlas URL format! Missing username, password, or cluster hostname. Format must be: mongodb+srv://username:password@cluster.mongodb.net/dbname. If you do not have a private database, leave this field empty.');
  }

  let tempConn;
  try {
    tempConn = await mongoose.createConnection(trimmedUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    }).asPromise();

    // Verify database ping
    await tempConn.db.admin().ping();
    await tempConn.close();
    return true;
  } catch (err) {
    if (tempConn) {
      try { await tempConn.close(); } catch (_) {}
    }
    throw new Error(`MongoDB Atlas Connection Failed: ${err.message}. Please check username, password, and ensure Network Access (0.0.0.0/0) is enabled on your MongoDB Atlas cluster. Or leave empty for default storage.`);
  }
};

/**
 * Get User Mongoose Model for a specific mongoUri
 */
export const getUserModelForUri = async (mongoUri) => {
  if (!mongoUri || mongoUri.trim() === '') {
    return User;
  }
  const conn = await getCustomConnection(mongoUri);
  return conn ? conn.model('User', User.schema) : User;
};

/**
 * Get Expense Mongoose Model for a specific user
 */
export const getExpenseModelForUser = async (user) => {
  if (!user || !user.mongoUri || user.mongoUri.trim() === '') {
    return Expense;
  }
  const conn = await getCustomConnection(user.mongoUri);
  return conn ? conn.model('Expense', Expense.schema) : Expense;
};

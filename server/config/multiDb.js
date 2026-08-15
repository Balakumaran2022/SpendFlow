import mongoose from 'mongoose';
import Expense from '../models/Expense.js';

const connectionMap = new Map();

// Strict MongoDB Atlas Connection URL Regex
export const MONGO_ATLAS_REGEX = /^mongodb(\+srv)?:\/\/[^\s:]+:[^\s@]+@[^\s\/]+(\/[^\s?]*)?(\?.*)?$/;

/**
 * Test a MongoDB connection URL to verify if it connects successfully
 */
export const testMongoConnection = async (mongoUri) => {
  if (!mongoUri || typeof mongoUri !== 'string') {
    throw new Error('Please provide a valid MongoDB Atlas connection string');
  }

  const trimmedUri = mongoUri.trim();
  
  if (!MONGO_ATLAS_REGEX.test(trimmedUri)) {
    throw new Error('Invalid MongoDB Atlas URL format! Must match pattern mongodb+srv://user:pass@cluster.mongodb.net/dbname');
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
    throw new Error(`MongoDB Atlas Connection Failed: ${err.message}`);
  }
};

/**
 * Get Expense Mongoose Model for a specific user
 * If user has custom mongoUri, return Expense model bound to their private Atlas database
 */
export const getExpenseModelForUser = async (user) => {
  if (!user || !user.mongoUri || user.mongoUri.trim() === '') {
    return Expense;
  }

  const uri = user.mongoUri.trim();

  if (connectionMap.has(uri)) {
    const conn = connectionMap.get(uri);
    if (conn.readyState === 1) {
      return conn.model('Expense', Expense.schema);
    }
  }

  try {
    const conn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    }).asPromise();

    connectionMap.set(uri, conn);
    return conn.model('Expense', Expense.schema);
  } catch (err) {
    console.error(`Failed to connect to user custom MongoDB Atlas (${user.email}):`, err.message);
    return Expense;
  }
};

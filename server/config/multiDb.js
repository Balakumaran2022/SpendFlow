import mongoose from 'mongoose';
import User from '../models/User.js';
import Expense from '../models/Expense.js';

const connectionMap = new Map();

/**
 * Automatically URL-encodes special characters (like @, #, %) in MongoDB passwords to prevent URI parsing / ENOTFOUND errors
 */
export const sanitizeMongoUri = (uri) => {
  if (!uri || typeof uri !== 'string') return uri;
  const trimmed = uri.trim();

  // Pattern: mongodb(+srv)://username:password@hostname/dbname
  const match = trimmed.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.+)$/i);
  if (!match) return trimmed;

  const scheme = match[1];
  const username = match[2];
  const rest = match[3]; // password@hostname/dbname...

  const lastAtIndex = rest.lastIndexOf('@');
  if (lastAtIndex === -1) return trimmed;

  const rawPassword = rest.substring(0, lastAtIndex);
  const hostAndPath = rest.substring(lastAtIndex + 1);

  try {
    const decodedPassword = decodeURIComponent(rawPassword);
    const encodedPassword = encodeURIComponent(decodedPassword);
    return `${scheme}${username}:${encodedPassword}@${hostAndPath}`;
  } catch (_) {
    const encodedPassword = encodeURIComponent(rawPassword);
    return `${scheme}${username}:${encodedPassword}@${hostAndPath}`;
  }
};

// Flexible MongoDB Atlas Connection URL Regex (Supports passwords with @ or special characters)
export const MONGO_ATLAS_REGEX = /^mongodb(\+srv)?:\/\/[^\s:]+:.+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}(\/[^\s?]*)?(\?.*)?$/;


/**
 * Get or establish Mongoose connection for a given MongoDB URI
 */
export const getCustomConnection = async (mongoUri) => {
  if (!mongoUri || typeof mongoUri !== 'string') return null;
  const uri = sanitizeMongoUri(mongoUri);

  if (connectionMap.has(uri)) {
    const conn = connectionMap.get(uri);
    if (conn.readyState === 1) return conn;
  }

  try {
    const conn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
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

  const sanitizedUri = sanitizeMongoUri(mongoUri);

  if (!MONGO_ATLAS_REGEX.test(sanitizedUri)) {
    throw new Error('Invalid MongoDB Atlas URL format! Missing cluster hostname domain (e.g. mongodb+srv://username:password@cluster0.xxxx.mongodb.net/dbname).');
  }

  let tempConn;
  try {
    tempConn = await mongoose.createConnection(sanitizedUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    }).asPromise();

    // Verify database ping
    await tempConn.db.admin().ping();
    await tempConn.close();
    return true;
  } catch (err) {
    if (tempConn) {
      try { await tempConn.close(); } catch (_) {}
    }
    throw new Error(`MongoDB Atlas Connection Failed: ${err.message}. Please check database username and password in MongoDB Atlas.`);
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

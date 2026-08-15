import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Expense from '../models/Expense.js';
import { testMongoConnection, getUserModelForUri } from '../config/multiDb.js';

const generateToken = (id, mongoUri = '') => {
  return jwt.sign({ id, mongoUri }, process.env.JWT_SECRET || 'balaspend_secret_key_123', {
    expiresIn: '3650d',
  });
};

// Seed default user (balaavcce@gmail.com / 12345678)
export const seedDefaultUser = async () => {
  try {
    const defaultEmail = 'balaavcce@gmail.com';
    let defaultUser = await User.findOne({ email: defaultEmail });

    if (!defaultUser) {
      console.log('Seeding default user: balaavcce@gmail.com ...');
      defaultUser = await User.create({
        name: 'Bala (Admin)',
        email: defaultEmail,
        password: '12345678',
      });
      console.log('Default user created successfully!');
    }

    if (defaultUser) {
      const result = await Expense.updateMany(
        { $or: [{ user: { $exists: false } }, { user: null }] },
        { $set: { user: defaultUser._id } }
      );
      if (result.modifiedCount > 0) {
        console.log(`Assigned ${result.modifiedCount} existing expenses to default user (${defaultEmail}).`);
      }
    }
  } catch (error) {
    console.error('Error seeding default user:', error.message);
  }
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, mongoUri } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const trimmedUri = mongoUri ? mongoUri.trim() : '';

    // If custom mongoUri is provided, validate format & test connection
    if (trimmedUri !== '') {
      try {
        await testMongoConnection(trimmedUri);
      } catch (connErr) {
        return res.status(400).json({
          success: false,
          message: `Registration Rejected: ${connErr.message}. Please check your MongoDB Atlas URL and credentials.`,
        });
      }
    }

    // Get Target User Model (Primary or Custom MongoDB Atlas)
    const TargetUserModel = await getUserModelForUri(trimmedUri);

    const userExists = await TargetUserModel.findOne({ email: trimmedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create User Document inside target MongoDB Atlas database
    const user = await TargetUserModel.create({
      name,
      email: trimmedEmail,
      password,
      mongoUri: trimmedUri,
    });

    // If custom DB, save lightweight pointer in master DB for fast login resolution
    if (trimmedUri !== '') {
      try {
        await User.create({
          name,
          email: trimmedEmail,
          password: user.password, // hashed password
          mongoUri: trimmedUri,
        });
      } catch (_) {}
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mongoUri: user.mongoUri,
        token: generateToken(user._id, user.mongoUri),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    const trimmedEmail = email.toLowerCase().trim();

    // 1. Check Master Registry User Document
    let masterUser = await User.findOne({ email: trimmedEmail });
    let mongoUri = masterUser ? masterUser.mongoUri : '';

    // 2. Get Target UserModel (Bound to user's MongoDB Atlas if mongoUri exists)
    const TargetUserModel = await getUserModelForUri(mongoUri);
    let user = await TargetUserModel.findOne({ email: trimmedEmail });

    if (!user && masterUser) {
      user = masterUser;
    }

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mongoUri: user.mongoUri || mongoUri,
          token: generateToken(user._id, user.mongoUri || mongoUri),
        },
      });
    }

    res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Current User Profile
export const getMe = async (req, res) => {
  try {
    const TargetUserModel = await getUserModelForUri(req.user.mongoUri);
    let user = await TargetUserModel.findById(req.user._id).select('-password');
    if (!user) {
      user = await User.findById(req.user._id).select('-password');
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

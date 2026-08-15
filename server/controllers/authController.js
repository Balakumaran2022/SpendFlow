import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Expense from '../models/Expense.js';
import { testMongoConnection } from '../config/multiDb.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'balaspend_secret_key_123', {
    expiresIn: '3650d', // Long-lived token so user stays logged in permanently
  });
};

// Seed default user (balaavcce@gmail.com / 12345678) and assign unassigned expenses
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

    // Assign any existing unassigned expenses to default user
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

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // STRICT VALIDATION: If custom mongoUri is provided, test connection before allowing registration
    if (mongoUri && mongoUri.trim() !== '') {
      try {
        await testMongoConnection(mongoUri.trim());
      } catch (connErr) {
        return res.status(400).json({
          success: false,
          message: `Registration Rejected: ${connErr.message}. Please check your MongoDB Atlas URL and credentials.`,
        });
      }
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      mongoUri: mongoUri ? mongoUri.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mongoUri: user.mongoUri,
        token: generateToken(user._id),
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

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mongoUri: user.mongoUri,
          token: generateToken(user._id),
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
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

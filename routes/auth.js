const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { isConnected } = require('../config/db');
const emailService = require('../services/emailService');

const router = express.Router();

// Middleware to ensure DB is connected before handling requests
const ensureDbConnected = (req, res, next) => {
  if (!isConnected()) {
    return res.status(503).json({ message: 'Service unavailable: database is disconnected.' });
  }
  next();
};

/**
 * Extract device information from request headers
 * @param {Object} req - Express request object
 * @returns {string} - Device/browser info
 */
const getDeviceInfo = (req) => {
  const userAgent = req.headers['user-agent'] || 'Unknown';
  
  // Simple parsing of user agent
  if (userAgent.includes('Chrome')) return 'Chrome Browser';
  if (userAgent.includes('Firefox')) return 'Firefox Browser';
  if (userAgent.includes('Safari')) return 'Safari Browser';
  if (userAgent.includes('Edge')) return 'Microsoft Edge';
  if (userAgent.includes('Mobile')) return 'Mobile Device';
  return 'Unknown Device';
};

/**
 * Get client IP address from request
 * @param {Object} req - Express request object
 * @returns {string} - IP address
 */
const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.connection.remoteAddress ||
    'Unknown'
  );
};

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production';
const JWT_EXPIRES_IN = '7d';

const createJwtToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

router.post('/register', ensureDbConnected, async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please provide full name, email, and password.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with that email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    const token = createJwtToken(user);

    // Send welcome email on registration (non-blocking)
    emailService.sendWelcomeEmail(user.email, user.fullName)
      .then(result => {
        if (result.success) {
          console.log(`✓ Welcome email sent successfully to ${user.email}`);
        } else {
          console.warn(`⚠ Welcome email failed for ${user.email}: ${result.error}`);
        }
      })
      .catch(err => {
        console.error(`✗ Error sending welcome email to ${user.email}:`, err.message);
      });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register user.' });
  }
});

router.post('/login', ensureDbConnected, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = createJwtToken(user);

    // Send welcome email on login to the user email.
    emailService.sendWelcomeEmail(user.email, user.fullName)
      .then(result => {
        if (result.success) {
          console.log(`✓ Welcome email sent successfully to ${user.email}`);
        } else {
          console.warn(`⚠ Welcome email failed for ${user.email}: ${result.error}`);
        }
      })
      .catch(err => {
        console.error(`✗ Error sending welcome email to ${user.email}:`, err.message);
      });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login.' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Profile lookup error:', error);
    res.status(500).json({ message: 'Failed to get user profile.' });
  }
});

module.exports = router;

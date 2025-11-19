const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await db.User.findOne({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const existingEmail = await db.User.findOne({
      where: { email }
    });

    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await db.User.create({
      username,
      email,
      password_hash,
      role: role || 'Customer'
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication error' });
    }

    if (!user) {
      return res.status(401).json({ error: info.message || 'Invalid credentials' });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login error' });
      }

      return res.json({
        message: 'Login successful',
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    });
  })(req, res, next);
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout error' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Check authentication status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: {
        user_id: req.user.user_id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');

// Register new user (Customer or Specialist only)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role, shop_name, specialty_element_id, contact_info } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const allowedRoles = ['Customer', 'Specialist'];
    const userRole = role || 'Customer';
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({ error: 'You can only register as Customer or Specialist' });
    }

    if (userRole === 'Specialist') {
      if (!shop_name || !specialty_element_id) {
        return res.status(400).json({ 
          error: 'Specialists must provide shop_name and specialty_element_id' 
        });
      }

      const element = await db.Element.findByPk(specialty_element_id);
      if (!element) {
        return res.status(400).json({ error: 'Invalid specialty element' });
      }
    }

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

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = await db.User.create({
      username,
      email,
      password_hash,
      role: userRole
    });

    let specialist = null;
    if (userRole === 'Specialist') {
      specialist = await db.Specialist.create({
        user_id: newUser.user_id,
        shop_name,
        specialty_element_id,
        contact_info: contact_info || null,
        reputation_rating: 5.00
      });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      specialist: specialist ? {
        specialist_id: specialist.specialist_id,
        shop_name: specialist.shop_name
      } : null
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

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

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout error' });
    }
    res.json({ message: 'Logout successful' });
  });
});

router.get('/status', async (req, res) => {
  if (req.isAuthenticated()) {
    let responseData = {
      isAuthenticated: true,
      user: {
        user_id: req.user.user_id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    };

    if (req.user.role === 'Specialist') {
      const specialist = await db.Specialist.findOne({
        where: { user_id: req.user.user_id }
      });
      if (specialist) {
        responseData.specialist_id = specialist.specialist_id;
      }
    }

    res.json(responseData);
  } else {
    res.json({ isAuthenticated: false });
  }
});

router.get('/elements', async (req, res) => {
  try {
    const elements = await db.Element.findAll();
    res.json(elements);
  } catch (error) {
    console.error('Error fetching elements:', error);
    res.status(500).json({ error: 'Error fetching elements' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../models');
const { isAuthenticated } = require('../middleware/auth');

router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.user_id, {
      attributes: ['user_id', 'username', 'email', 'role', 'created_at']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'Specialist') {
      const specialist = await db.Specialist.findOne({
        where: { user_id: user.user_id },
        include: [{
          model: db.Element,
          as: 'specialtyElement'
        }]
      });

      return res.json({
        ...user.toJSON(),
        specialist
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await db.User.findByPk(req.user.user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (email) {
      const existingEmail = await db.User.findOne({
        where: { 
          email,
          user_id: { [db.Sequelize.Op.ne]: user.user_id }
        }
      });

      if (existingEmail) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      user.email = email;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

module.exports = router;
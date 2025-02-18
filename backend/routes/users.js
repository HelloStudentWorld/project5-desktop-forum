const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, Post } = require('../models');

// Get a user's profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'email', 'bio', 'profile_picture', 'created_at'],
      include: [{ model: Post, as: 'posts', attributes: ['id', 'title', 'created_at'] }],
      order: [[{ model: Post, as: 'posts' }, 'created_at', 'DESC']],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

// Update profile
router.put('/:id', auth, async (req, res) => {
  try {
    const { bio, profile_picture } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only allow if the logged-in user owns this profile
    if (user.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    user.bio = bio || user.bio;
    user.profile_picture = profile_picture || user.profile_picture;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error updating profile', error: err.message });
  }
});

module.exports = router;
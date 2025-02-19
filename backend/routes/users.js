const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, Post } = require('../models');
const { processProfileImage } = require('../utils/imageProcessor');

// Get a user's profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'email', 'bio', 'profile_picture', 'created_at'],
      include: [{ model: Post, as: 'posts', attributes: ['id', 'title', 'content', 'created_at', 'user_id'] }],
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
    // Validate user exists and check authorization
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        details: 'The requested user profile does not exist'
      });
    }

    if (user.id !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized',
        details: 'You can only update your own profile'
      });
    }

    const { bio, profile_picture: base64Image } = req.body;

    // Update bio if provided
    user.bio = bio || user.bio;
    
    // Process and save new profile picture if provided
    if (base64Image) {
      try {
        const imagePath = await processProfileImage(base64Image, user.id);
        user.profile_picture = imagePath;
      } catch (imageError) {
        return res.status(400).json({
          message: 'Error processing profile picture',
          details: imageError.message
        });
      }
    }
    
    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ 
      message: 'Error updating profile',
      details: err.message
    });
  }
});

module.exports = router;
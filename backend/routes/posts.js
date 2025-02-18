const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Post, User, Comment } = require('../models');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
      order: [['created_at', 'DESC']],
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
});

// Get single post with comments
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
        },
      ],
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post', error: err.message });
  }
});

// Create new post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = await Post.create({
      title,
      content,
      user_id: req.user.id,
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: 'Error creating post', error: err.message });
  }
});

// Update a post
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check ownership
    if (post.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: 'Error updating post', error: err.message });
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check ownership
    if (post.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post', error: err.message });
  }
});

module.exports = router;
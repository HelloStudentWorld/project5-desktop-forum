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
    const { title, content, category_id, isIntroduction } = req.body;
    
    // Validate required fields
    if (!title || !content || !category_id) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          title: !title ? 'Title is required' : null,
          content: !content ? 'Content is required' : null,
          category_id: !category_id ? 'Category is required' : null
        }
      });
    }

    // Skip question mark validation for introduction posts
    if (!isIntroduction && !title.trim().endsWith('?')) {
      return res.status(400).json({ 
        message: 'Title must end with a question mark'
      });
    }

    const newPost = await Post.create({
      title,
      content,
      user_id: req.user.id,
      category_id
    });

    // Fetch the created post with author details
    const postWithDetails = await Post.findByPk(newPost.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }]
    });

    res.status(201).json(postWithDetails);
  } catch (err) {
    res.status(400).json({ message: 'Error creating post', error: err.message });
  }
});

// Update a post
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, category_id, isIntroduction } = req.body;
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check ownership
    if (post.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Validate title if it's being updated
    if (title && !isIntroduction && !title.trim().endsWith('?')) {
      return res.status(400).json({ 
        message: 'Title must end with a question mark'
      });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    if (category_id) post.category_id = category_id;
    await post.save();

    // Fetch and return the updated post with author details
    const updatedPost = await Post.findByPk(post.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
        },
      ],
    });
    res.json(updatedPost);
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
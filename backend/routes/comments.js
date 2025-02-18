const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Comment, Post, User } = require('../models');

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { post_id: req.params.postId },
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
      order: [['created_at', 'ASC']],
    });
    res.json(comments);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching comments', error: err.message });
  }
});

// Create a comment (requires auth)
router.post('/post/:postId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findByPk(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = await Comment.create({
      content,
      user_id: req.user.id,
      post_id: req.params.postId,
    });
    res.status(201).json(newComment);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error creating comment', error: err.message });
  }
});

// Edit comment
router.put('/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check ownership
    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.content = req.body.content || comment.content;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: 'Error updating comment', error: err.message });
  }
});

// Delete comment
router.delete('/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check ownership
    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting comment', error: err.message });
  }
});

module.exports = router;
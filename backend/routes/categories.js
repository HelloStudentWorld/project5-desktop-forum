const express = require('express');
const router = express.Router();
const { Category, Post, User } = require('../models');
const auth = require('../middleware/auth');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'description', 'slug'],
      include: [
        {
          model: Post,
          as: 'posts',
          attributes: ['id'],
        },
      ],
    });

    // Add post count to each category
    const categoriesWithCount = categories.map(category => ({
      ...category.toJSON(),
      postCount: category.posts.length
    }));

    res.json(categoriesWithCount);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Get single category with its posts
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          model: Post,
          as: 'posts',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'profile_picture'],
            },
          ],
          order: [['created_at', 'DESC']],
          separate: true
        },
      ],
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Error fetching category' });
  }
});

// Create new category (admin only - we'll add admin check middleware later)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const category = await Category.create({
      name,
      description,
      slug,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Category already exists' });
    } else {
      res.status(500).json({ message: 'Error creating category' });
    }
  }
});

// Update category (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update slug if name changes
    const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : category.slug;

    await category.update({
      name: name || category.name,
      description: description || category.description,
      slug,
    });

    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category' });
  }
});

// Delete category (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
});

module.exports = router;
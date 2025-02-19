require('dotenv').config();
const { sequelize, Category } = require('../models');

const categories = [
  {
    name: 'General Discussion',
    description: 'A place for general topics and conversations',
    slug: 'general-discussion'
  },
  {
    name: 'Tech Talk',
    description: 'Discuss the latest in technology, programming, and software development',
    slug: 'tech-talk'
  },
  {
    name: 'Help & Support',
    description: 'Ask questions and get help from the community',
    slug: 'help-support'
  },
  {
    name: 'News & Updates',
    description: 'Stay up to date with the latest news and platform updates',
    slug: 'news-updates'
  },
  {
    name: 'Introductions',
    description: 'New to the forum? Introduce yourself here!',
    slug: 'introductions'
  }
];

async function seedCategories() {
  try {
    // Sync database
    await sequelize.sync();

    // Create categories
    for (const category of categories) {
      await Category.findOrCreate({
        where: { slug: category.slug },
        defaults: category
      });
    }

    console.log('Categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
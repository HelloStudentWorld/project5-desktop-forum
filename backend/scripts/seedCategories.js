require('dotenv').config();
const { sequelize, Category } = require('../models');

const oldSlugs = [
  'general-discussion',
  'tech-talk',
  'help-support',
  'news-updates',
  'introductions'
];

const categories = [
  {
    name: 'Perception & Sensor Fusion',
    description: 'For questions related to camera, LiDAR, radar integration, sensor calibration, object detection, and multi-sensor fusion on the NVIDIA platform.',
    slug: 'perception-sensor-fusion'
  },
  {
    name: 'Localization & Mapping',
    description: 'For questions about GPS integration, SLAM (Simultaneous Localization and Mapping), HD maps, and related localization approaches.',
    slug: 'localization-mapping'
  },
  {
    name: 'Path Planning & Control',
    description: 'For questions around motion planning algorithms, trajectory generation, and low-level vehicle control (steering, braking, throttle).',
    slug: 'path-planning-control'
  },
  {
    name: 'Behavior Prediction & Decision Making',
    description: 'For questions about predicting other vehicles/pedestrians, implementing decision-making logic (rule-based or AI-driven), and handling complex traffic scenarios.',
    slug: 'behavior-prediction-decision-making'
  },
  {
    name: 'Safety & Validation',
    description: 'For questions regarding system safety, validation strategies, test protocols, and standards compliance (e.g., ISO 26262).',
    slug: 'safety-validation'
  },
  {
    name: 'Hardware & Infrastructure',
    description: 'For questions about hardware integration, computing modules (e.g., NVIDIA DRIVE AGX), wiring harnesses, power systems, and on-vehicle setups.',
    slug: 'hardware-infrastructure'
  },
  {
    name: 'General Q&A on NVIDIA Autonomous Tech',
    description: 'Catch-all category for any AV or NVIDIA DRIVE-related question not covered above.',
    slug: 'general-nvidia-av-qa'
  }
];

async function seedCategories() {
  try {
    // Sync database
    await sequelize.sync();

    // Delete old categories
    console.log('Removing old categories...');
    await Category.destroy({
      where: {
        slug: oldSlugs
      }
    });
    console.log('Old categories removed successfully!');

    // Create new categories
    console.log('Creating new categories...');
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
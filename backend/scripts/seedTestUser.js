require('dotenv').config();
const { sequelize, User } = require('../models');
const bcrypt = require('bcryptjs');

const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password_hash: 'password123',
  bio: 'Test user account',
};

async function seedTestUser() {
  try {
    // Sync database
    await sequelize.sync();

    // Hash the password before creating the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password_hash, salt);
    testUser.password_hash = hashedPassword;

    // Create test user
    const [user, created] = await User.findOrCreate({
      where: { email: testUser.email },
      defaults: testUser
    });

    if (created) {
      console.log('Test user created successfully!');
      console.log('Login credentials:');
      console.log('Email:', testUser.email);
      console.log('Password: password123');
    } else {
      console.log('Test user already exists');
      console.log('You can login with:');
      console.log('Email:', testUser.email);
      console.log('Password: password123');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding test user:', error);
    process.exit(1);
  }
}

seedTestUser();
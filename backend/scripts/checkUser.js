require('dotenv').config();
const { User } = require('../models');

async function checkUser() {
  try {
    const user = await User.findOne({ where: { email: 'test@example.com' } });
    if (!user) {
      console.log('User not found');
      return;
    }
    console.log('User found:', {
      id: user.id,
      email: user.email,
      username: user.username,
      hasPasswordHash: !!user.password_hash,
      passwordHashLength: user.password_hash ? user.password_hash.length : 0
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

checkUser();
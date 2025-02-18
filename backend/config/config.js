require('dotenv').config();

// Use JAWSDB_URL for both development and production since we have it
const dbConfig = {
  url: process.env.JAWSDB_URL,
  dialect: 'mysql',
  logging: false,
};

module.exports = {
  development: dbConfig,
  production: dbConfig
};
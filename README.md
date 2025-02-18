# project5-desktop-forum
 
backend/
├── package.json
├── server.js
├── config/
├── models/
├── routes/
└── .env     // For local dev

# 2/17/2025 11:16pm

completed the following:

1. Initialize Your Project Locally
Clone your new GitHub repository to your local machine:
bash
Copy
git clone https://github.com/your-username/your-forum-repo.git
cd your-forum-repo
(Optional) If using a monorepo approach with backend/ and client/ in the same repository, create those folders now:
bash
Copy
mkdir backend client
Create a .gitignore file to exclude node_modules, .env, and other sensitive or large files.
2. Set Up the Backend (Node.js + Express)
Within your new backend/ folder:

Initialize a Node.js project:

bash
Copy
cd backend
npm init -y
This creates a package.json.

Install dependencies:

bash
Copy
npm install express cors dotenv mysql2 sequelize bcrypt jsonwebtoken body-parser
npm install --save-dev nodemon
express for the server
cors for cross-origin requests
dotenv for environment variables
mysql2 + sequelize for MySQL/ORM
bcrypt for password hashing
jsonwebtoken for JWT auth
nodemon (dev dependency) for auto-restarts during development
Create essential backend files (e.g., server.js, config/, models/, routes/), following the structure in your plan.

Example:
lua
Copy
backend/
├── package.json
├── server.js
├── config/
├── models/
├── routes/
└── .env     // For local dev
Add the boilerplate code for server.js, referencing your plan:

js
Copy
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// TODO: Import routes & use them, e.g.:
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
Create your .env file with local dev credentials (DB credentials, JWT_SECRET, etc.). Never commit .env to GitHub.

Commit your backend initial setup and push to GitHub.

## working on mysql database setup on heroku


3. Set Up the Database (Local MySQL)
Install/confirm MySQL server is running locally.
Create a local database for dev/testing, e.g., forum_dev.
Configure your .env or config/config.js so Sequelize (or your chosen approach) can connect:
bash
Copy
DB_USERNAME=root
DB_PASSWORD=example
DB_NAME=forum_dev
DB_HOST=127.0.0.1
JWT_SECRET=some_local_secret
Test the connection. If using Sequelize, try running a basic sync or a simple script to confirm it connects.

-------------------------------
-------------------------------

1. Add the ClearDB MySQL Add-on
Create (or use an existing) Heroku app. From your local machine (CLI):
bash


Add ClearDB to your Heroku app:
bash
heroku addons:create cleardb:ignite --app your-forum-backend

cleardb:ignite is the free tier.
Replace your-forum-backend with the name of your Heroku app.

Check if it was added successfully:

bash
Copy
Edit
heroku addons --app your-forum-backend
You should see ClearDB in the list of add-ons.



(base) PS C:\Projects\project5-desktop-forum> heroku config
>>
 »   Warning: heroku update available from 10.0.0 to 10.1.0.
=== project5-forum Config Vars

JAWSDB_URL: mysql://j9ardwoqf9ri28im:t9a5u7jghbfkxaxm@muowdopceqgxjn2b3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/g09ulh90j921m0uu



-------------------------------
-------------------------------



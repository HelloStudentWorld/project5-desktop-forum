# Drive Vision Forum - 3-Tier Architecture Forum Application

A full-stack forum application built with React, Node.js, and MySQL that allows users to register, log in, and participate in discussions. This project demonstrates the implementation of a 3-tier architecture with separate data, application, and presentation layers.

## 🌟 Features

- **User Authentication**
  - User registration with validation
  - Secure login system
  - JWT-based authentication

- **Forum Functionality**
  - Browse categories
  - Create and view posts
  - Add comments to posts
  - Markdown support for posts

- **User Interface**
  - Responsive design
  - Category sidebar navigation
  - Rich text editing with Markdown
  - Profile management

## 🛠 Tech Stack

### Frontend (Presentation Layer)
- React 18
- Redux Toolkit for state management
- React Router for navigation
- Axios for API requests
- React Markdown for content rendering

### Backend (Application Layer)
- Node.js 18
- Express.js
- JSON Web Tokens (JWT) for authentication
- CORS support

### Database (Data Layer)
- MySQL (via JAWSDB)
- Sequelize ORM

## 📋 Prerequisites

- Node.js 18.x
- MySQL database
- Git

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project5-desktop-forum
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file with:
   ```
   JAWSDB_URL=your_jawsdb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

4. **Seed the Database**
   ```bash
   cd ../backend
   npm run seed
   ```

## 🏃‍♂️ Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev     # Development with nodemon
   # or
   npm start       # Production
   ```
   Server will run on http://localhost:5000

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm start
   ```
   Client will run on http://localhost:3000

## 📁 Project Structure

```
project5-desktop-forum/
├── backend/                 # Backend application
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth middleware
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── scripts/           # Database scripts
│   └── utils/             # Utility functions
│
└── client/                # Frontend application
    ├── public/           # Static files
    └── src/
        ├── app/          # Redux store setup
        ├── components/   # React components
        ├── features/     # Redux slices
        └── services/     # API services
```

## 🌐 API Endpoints

- **Auth Routes**
  - POST `/api/auth/register` - Register new user
  - POST `/api/auth/login` - User login

- **Categories**
  - GET `/api/categories` - Get all categories
  - GET `/api/categories/:id` - Get category details

- **Posts**
  - GET `/api/posts` - Get all posts
  - POST `/api/posts` - Create new post
  - GET `/api/posts/:id` - Get post details

- **Comments**
  - GET `/api/posts/:id/comments` - Get post comments
  - POST `/api/posts/:id/comments` - Add comment

##  Deployment

The application is deployed on Heroku:
- Project name: project5-forum
- Database: JAWSDB MySQL add-on

## Evaluation Criteria

### Functionality 
- Complete user authentication system
- Forum functionality with categories, posts, and comments
- Profile management
- Markdown support for rich text

### Robustness 
- Error handling
- Input validation
- Secure authentication

### Creativity & Styling 
- Responsive design
- User-friendly interface
- Markdown support

### Code Quality 
- Consistent coding patterns
- Component organization
- Redux implementation
- Error handling

### GitHub Structure 
- Proper .gitignore
- Granular commits
- Clear commit messages
- Organized repository structure

### Documentation 
- Comprehensive README
- Clear installation instructions
- API documentation
- Code comments

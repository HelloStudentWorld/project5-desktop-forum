# Frontend Structure

## Additional Dependencies
```json
{
  "axios": "^1.3.4",
  "react-router-dom": "^6.8.2"
}
```

## Directory Structure
```
client/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── auth/
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── posts/
│   │   │   ├── PostList.js
│   │   │   ├── PostCard.js
│   │   │   ├── PostDetail.js
│   │   │   └── PostForm.js
│   │   ├── comments/
│   │   │   ├── CommentList.js
│   │   │   └── CommentForm.js
│   │   └── profile/
│   │       └── Profile.js
│   ├── features/
│   │   ├── auth/
│   │   │   └── authSlice.js
│   │   ├── posts/
│   │   │   └── postsSlice.js
│   │   └── comments/
│   │       └── commentsSlice.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   └── index.js
└── package.json
```

## Redux Store Structure
```javascript
{
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  posts: {
    items: [],
    currentPost: null,
    loading: false,
    error: null
  },
  comments: {
    items: [],
    loading: false,
    error: null
  }
}
```

## API Service Structure
```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```

## Routes
```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forum" element={<PrivateRoute><PostList /></PrivateRoute>} />
  <Route path="/post/:id" element={<PrivateRoute><PostDetail /></PrivateRoute>} />
  <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
</Routes>
```

## Component Features

### Auth Components
- Login: Email/password login form
- Register: Username/email/password registration form
- PrivateRoute: Route wrapper that checks authentication

### Post Components
- PostList: Display all posts with pagination
- PostCard: Individual post preview
- PostDetail: Full post view with comments
- PostForm: Create/edit post form

### Comment Components
- CommentList: Display comments for a post
- CommentForm: Add new comment

### Profile Component
- Display user information
- Show user's posts
- Edit profile functionality

## Styling
- Use CSS modules for component-specific styles
- Implement responsive design
- Consider using a UI library like Material-UI or Tailwind CSS
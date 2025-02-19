import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/layout/PrivateRoute';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PostList from './components/posts/PostList';
import PostDetail from './components/posts/PostDetail';
import CategoryList from './components/categories/CategoryList';
import CategoryDetail from './components/categories/CategoryDetail';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/forum"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <CategoryList />
              </PrivateRoute>
            }
          />
          <Route
            path="/category/:slug"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <CategoryDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/post/:id"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <PostDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <EditProfile />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

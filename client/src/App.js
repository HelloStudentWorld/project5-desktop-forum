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
import Profile from './components/profile/Profile';

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
                <PostList />
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
        </Routes>
      </div>
    </div>
  );
}

export default App;

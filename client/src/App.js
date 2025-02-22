import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from './features/auth/authSlice';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/layout/PrivateRoute';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PostList from './components/posts/PostList';
import PostDetail from './components/posts/PostDetail';
import Dashboard from './components/layout/Dashboard';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token)
      dispatch(loadUser());
  }, [dispatch, token]);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<div className="container"><Home /></div>} />
        <Route path="/login" element={<div className="container"><Login /></div>} />
        <Route path="/register" element={
          <div className="container"><Register /></div>
        } />
        <Route
          path="/forum"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="container"><PostDetail /></div>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="container"><Profile /></div>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="container"><EditProfile /></div>
            </PrivateRoute>
          }
        />
        </Routes>
    </div>
  );
}

export default App;

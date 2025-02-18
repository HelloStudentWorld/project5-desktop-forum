import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="home-container">
      <h1>Welcome to Forum App</h1>
      <p>A place to discuss interesting topics and share ideas.</p>
      
      <div className="cta-container">
        {isAuthenticated ? (
          <Link to="/forum" className="cta-button">
            Go to Forum
          </Link>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="cta-button">
              Login
            </Link>
            <Link to="/register" className="cta-button">
              Register
            </Link>
          </div>
        )}
      </div>

      <div className="features">
        <h2>Features</h2>
        <ul>
          <li>Create and participate in discussions</li>
          <li>Share your thoughts and ideas</li>
          <li>Connect with other users</li>
          <li>Personalize your profile</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
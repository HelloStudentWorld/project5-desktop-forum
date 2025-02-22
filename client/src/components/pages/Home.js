import React, { useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../features/categories/categoriesSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { status } = useSelector((state) => state.categories);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  return (
    <div className="home-container">
      <h1>Welcome to Drive Vision Forum</h1>
      <p>Your community hub for automotive enthusiasts to discuss vehicles, share experiences, and explore the future of driving.</p>
      
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
          <li>Engage in discussions about vehicles, technology, and driving experiences</li>
          <li>Share automotive knowledge and get expert advice</li>
          <li>Connect with fellow car enthusiasts and professionals</li>
          <li>Stay updated on the latest automotive trends and innovations</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
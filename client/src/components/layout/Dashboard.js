import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import CategorySidebar from '../categories/CategorySidebar';
import CategoryDetail from '../categories/CategoryDetail';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();
  const { categories, status } = useSelector((state) => state.categories);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <CategorySidebar 
          categories={categories} 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          loading={status === 'loading'}
        />
      </div>
      <div className="dashboard-main">
        {selectedCategory ? (
          <CategoryDetail categorySlug={selectedCategory} />
        ) : (
          <div className="select-category-message">
            <h2>Welcome to the Forum</h2>
            <p>Select a category from the left to view discussions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Categories.css';
import { fetchCategories } from '../../features/categories/categoriesSlice';

const CategoryList = () => {
  const dispatch = useDispatch();
  const categoriesState = useSelector((state) => state.categories);
  const { categories = [], status, error } = categoriesState || {};

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div>Loading categories...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (!categories || categories.length === 0) {
    return <div>No categories found.</div>;
  }

  return (
    <div className="categories-container">
      <h2>Categories</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="category-card"
          >
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <div className="category-stats">
              <span>{category.postCount || 0} posts</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
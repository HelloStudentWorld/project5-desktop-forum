import React from 'react';
import './Categories.css';

const CategorySidebar = ({ categories = [], selectedCategory, onSelectCategory, loading }) => {
  if (loading) {
    return (
      <div className="category-sidebar">
        <h2>Categories</h2>
        <div className="loading">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="category-sidebar">
      <h2>Categories</h2>
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-item ${selectedCategory === category.slug ? 'selected' : ''}`}
            onClick={() => onSelectCategory(category.slug)}
          >
            <h3>{category.name}</h3>
            <span className="post-count">{category.postCount || 0} posts</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Categories.css';
import { fetchCategoryPosts } from '../../features/categories/categoriesSlice';
import PostList from '../posts/PostList';

const CategoryDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentCategory, status, error } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategoryPosts(slug));
  }, [dispatch, slug]);

  if (status === 'loading') {
    return <div>Loading category posts...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (!currentCategory) {
    return <div>Category not found</div>;
  }

  return (
    <div className="category-detail">
      <div className="category-header">
        <h1>{currentCategory.name}</h1>
        <p>{currentCategory.description}</p>
      </div>

      <div className="category-content">
        <h2>Posts in {currentCategory.name}</h2>
        {currentCategory.posts && currentCategory.posts.length > 0 ? (
          <PostList posts={currentCategory.posts} />
        ) : (
          <p>No posts in this category yet.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
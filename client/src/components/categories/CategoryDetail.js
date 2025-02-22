import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Categories.css';
import { fetchCategoryPosts } from '../../features/categories/categoriesSlice';
import PostList from '../posts/PostList';
import PostForm from '../posts/PostForm';

const CategoryDetail = ({ categorySlug }) => {
  const [showPostForm, setShowPostForm] = useState(false);
  const dispatch = useDispatch();
  const { currentCategory, status, error } = useSelector(
    (state) => state.categories
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (categorySlug) {
      dispatch(fetchCategoryPosts(categorySlug));
    }
  }, [dispatch, categorySlug]);

  const handlePostSuccess = () => {
    setShowPostForm(false);
    // Refresh the category posts
    dispatch(fetchCategoryPosts(categorySlug));
  };

  return (
    <div className="category-detail">
      {/* Always render the header and modal */}
      <div className="category-header">
        <div className="header-content">
          <h1>{currentCategory?.name || 'Loading...'}</h1>
          <p>{currentCategory?.description}</p>
        </div>
        {isAuthenticated && (
          <button 
            className="new-post-button"
            onClick={() => setShowPostForm(true)}
          >
            Ask a Question
          </button>
        )}
      </div>

      {showPostForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Ask a Question in {currentCategory?.name}</h2>
              <button 
                className="close-button"
                onClick={() => setShowPostForm(false)}
              >
                ×
              </button>
            </div>
            <PostForm 
              onSuccess={handlePostSuccess}
              initialCategory={currentCategory?.id}
            />
          </div>
        </div>
      )}

      {/* Render content based on loading state */}
      <div className="category-content">
        {status === 'loading' && !currentCategory ? (
          <div className="loading">Loading category posts...</div>
        ) : status === 'failed' ? (
          <div className="error">Error: {error}</div>
        ) : !currentCategory ? (
          <div className="not-found">Category not found</div>
        ) : (
          <>
            <h2>Questions in {currentCategory.name}</h2>
            {currentCategory.posts && currentCategory.posts.length > 0 ? (
              <PostList posts={currentCategory.posts} hideCreateButton={true} />
            ) : (
              <p>No questions in this category yet. Be the first to ask!</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
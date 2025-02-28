import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../features/posts/postsSlice';
import PostCard from './PostCard';
import PostForm from './PostForm';

const PostList = ({ posts: propPosts, hideCreateButton = false }) => {
  const dispatch = useDispatch();
  const { list: posts, loading, error } = useSelector((state) => state.posts);
  const [showPostForm, setShowPostForm] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);
  
  const displayPosts = propPosts || posts;

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h2>Forum Posts</h2>
        {!hideCreateButton && (
          <button
            className="create-post-btn"
            onClick={() => setShowPostForm(!showPostForm)}
          >
            {showPostForm ? 'Cancel' : 'Create New Post'}
          </button>
        )}
      </div>

      {showPostForm && (
        <PostForm
          onSuccess={() => {
            setShowPostForm(false);
            dispatch(fetchPosts());
          }}
        />
      )}

      <div className="posts-list">
        {displayPosts.length === 0 ? (
          <p>No posts yet. Be the first to create one!</p>
        ) : (
          displayPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default PostList;
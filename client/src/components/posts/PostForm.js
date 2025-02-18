import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost } from '../../features/posts/postsSlice';

const PostForm = ({ post, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.posts);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
      });
    }
  }, [post]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      if (post) {
        // Update existing post
        await dispatch(
          updatePost({ postId: post.id, postData: formData })
        ).unwrap();
      } else {
        // Create new post
        await dispatch(createPost(formData)).unwrap();
      }
      
      // Clear form and call success callback
      setFormData({ title: '', content: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="post-form">
      <h3>{post ? 'Edit Post' : 'Create New Post'}</h3>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content here"
            rows="6"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
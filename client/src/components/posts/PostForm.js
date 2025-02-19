import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost } from '../../features/posts/postsSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';

const PostForm = ({ post, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.posts);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        category_id: post.category_id || '',
      });
    }
  }, [post]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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

    if (!formData.category_id) {
      setError('Please select a category');
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
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
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
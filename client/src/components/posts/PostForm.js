import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost } from '../../features/posts/postsSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';

const PostForm = ({ post, onSuccess, initialCategory }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: initialCategory || '',
  });
  const [errors, setErrors] = useState({});
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
    if (initialCategory) {
      setFormData(prev => ({
        ...prev,
        category_id: initialCategory
      }));
    }
  }, [initialCategory]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    const selectedCategory = categories.find(cat => cat.id === parseInt(formData.category_id));
    const isIntroduction = selectedCategory?.slug === 'introductions';

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (!isIntroduction && !formData.title.trim().endsWith('?')) {
      newErrors.title = 'Title must end with a question mark';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.category_id) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const selectedCategory = categories.find(cat => cat.id === parseInt(formData.category_id));
      const isIntroduction = selectedCategory?.slug === 'introductions';
      const postData = { ...formData, isIntroduction };

      if (post) {
        await dispatch(updatePost({ postId: post.id, postData })).unwrap();
      } else {
        await dispatch(createPost(postData)).unwrap();
      }
      
      setFormData({ title: '', content: '', category_id: initialCategory || '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.response?.data?.details) {
        setErrors(err.response.data.details);
      } else {
        setErrors({ general: err.message || 'An error occurred' });
      }
    }
  };

  const isIntroductionCategory = formData.category_id && 
    categories.find(cat => cat.id === parseInt(formData.category_id))?.slug === 'introductions';

  return (
    <div className="post-form">
      {errors.general && (
        <div className="error-message">{errors.general}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            {isIntroductionCategory ? 'Introduction Title:' : 'Question Title:'}
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={isIntroductionCategory 
              ? "Enter your introduction title" 
              : "Enter your question (must end with a ?)"}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && (
            <div className="error-message">{errors.title}</div>
          )}
          <small className="form-help">
            {isIntroductionCategory
              ? "Enter a clear title for your introduction"
              : "Your title should be a clear question that ends with a question mark (?)"}
          </small>
        </div>

        {!initialCategory && (
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="error-message">{errors.category}</div>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder={isIntroductionCategory
              ? "Provide details about your introduction"
              : "Provide details about your question"}
            rows="6"
            className={errors.content ? 'error' : ''}
          />
          {errors.content && (
            <div className="error-message">{errors.content}</div>
          )}
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Saving...' : post 
            ? (isIntroductionCategory ? 'Update Introduction' : 'Update Question')
            : (isIntroductionCategory ? 'Post Introduction' : 'Post Question')}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `/api/comments/post/${postId}`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setContent('');
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-form">
      <h4>Add a Comment</h4>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment here..."
            rows="3"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
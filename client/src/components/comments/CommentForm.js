import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import '../posts/Markdown.css';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const markdownTips = `
Quick Markdown Tips:
- **bold** text using \`**text**\`
- *italic* text using \`*text*\`
- [links](url) using \`[text](url)\`
- \`code\` using backticks
- > quotes using \`>\`
`;

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
      setShowPreview(false);
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
      <div className="comment-form-header">
        <h4>Add a Comment</h4>
        <div className="comment-form-actions">
          <button
            type="button"
            className={`preview-toggle ${showPreview ? 'active' : ''}`}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            type="button"
            className="help-toggle"
            onClick={() => setShowHelp(!showHelp)}
            title="Show markdown tips"
          >
            ?
          </button>
        </div>
      </div>

      {showHelp && (
        <div className="markdown-help markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownTips}
          </ReactMarkdown>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          {showPreview ? (
            <div className="comment-preview markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || '*Preview your comment here*'}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your comment here... (Markdown formatting supported)"
              rows="3"
              required
            />
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
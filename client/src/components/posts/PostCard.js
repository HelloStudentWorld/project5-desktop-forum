import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PostCard = ({ post }) => {
  const { user } = useSelector((state) => state.auth);
  const isAuthor = user?.id === post.user_id;

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Truncate content if it's too long
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <h3>
          <Link to={`/post/${post.id}`} className="post-title">
            {post.title}
          </Link>
        </h3>
        <div className="post-meta">
          <span className="post-author">
            By{' '}
            <Link to={`/profile/${post.author?.id}`}>
              {post.author?.username}
            </Link>
          </span>
          <span className="post-date">{formatDate(post.created_at)}</span>
          {post.updated_at !== post.created_at && (
            <span className="post-edited">(edited)</span>
          )}
        </div>
      </div>

      <div className="post-content">
        <p>{truncateContent(post.content)}</p>
      </div>

      <div className="post-footer">
        <Link to={`/post/${post.id}`} className="read-more">
          Read More
        </Link>
        {isAuthor && (
          <div className="post-actions">
            <Link to={`/post/${post.id}/edit`} className="edit-link">
              Edit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
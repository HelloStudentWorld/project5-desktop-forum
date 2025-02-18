import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CommentList = ({ comments = [] }) => {
  const { user } = useSelector((state) => state.auth);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (comments.length === 0) {
    return <p className="no-comments">No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="comment-header">
            <Link to={`/profile/${comment.author?.id}`} className="comment-author">
              {comment.author?.username}
            </Link>
            <span className="comment-date">
              {formatDate(comment.created_at)}
            </span>
          </div>
          <div className="comment-content">
            <p>{comment.content}</p>
          </div>
          {user?.id === comment.user_id && (
            <div className="comment-actions">
              <button className="edit-button">Edit</button>
              <button className="delete-button">Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
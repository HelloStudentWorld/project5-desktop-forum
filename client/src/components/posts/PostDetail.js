import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPostById,
  deletePost,
  clearCurrentPost,
} from '../../features/posts/postsSlice';
import PostForm from './PostForm';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPost: post, loading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchPostById(id));
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await dispatch(deletePost(id)).unwrap();
        navigate('/forum');
      } catch (err) {
        console.error('Failed to delete post:', err);
      }
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    dispatch(fetchPostById(id));
  };

  const handleCommentAdded = () => {
    dispatch(fetchPostById(id));
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!post) {
    return <div className="not-found">Post not found</div>;
  }

  const isAuthor = user?.id === post.user_id;

  return (
    <div className="post-detail">
      {isEditing ? (
        <PostForm post={post} onSuccess={handleEditSuccess} />
      ) : (
        <>
          <div className="post-header">
            <h2>{post.title}</h2>
            <div className="post-meta">
              <span>By {post.author?.username}</span>
              <span>
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              {post.updated_at !== post.created_at && (
                <span>(edited)</span>
              )}
            </div>
          </div>

          <div className="post-content">
            <p>{post.content}</p>
          </div>

          {isAuthor && (
            <div className="post-actions">
              <button
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
                Edit Post
              </button>
              <button
                onClick={handleDelete}
                className="delete-button"
              >
                Delete Post
              </button>
            </div>
          )}

          <div className="comments-section">
            <h3>Comments</h3>
            <CommentForm postId={id} onCommentAdded={handleCommentAdded} />
            <CommentList comments={post.comments} postId={id} />
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetail;
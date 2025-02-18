import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import PostCard from '../posts/PostCard';

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useSelector((state) => state.auth);
  const isOwnProfile = currentUser?.id === parseInt(id);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setProfile(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="not-found">Profile not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <h2>{profile.username}'s Profile</h2>
          <p className="member-since">
            Member since {formatDate(profile.created_at)}
          </p>
          {profile.bio && <p className="bio">{profile.bio}</p>}
        </div>
        {isOwnProfile && (
          <Link to="/profile/edit" className="edit-profile-btn">
            Edit Profile
          </Link>
        )}
      </div>

      <div className="profile-posts">
        <h3>Posts by {profile.username}</h3>
        {profile.posts?.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div className="posts-grid">
            {profile.posts?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      <div className="profile-stats">
        <div className="stat">
          <span className="stat-label">Total Posts:</span>
          <span className="stat-value">{profile.posts?.length || 0}</span>
        </div>
        {/* Add more stats here if needed */}
      </div>
    </div>
  );
};

export default Profile;
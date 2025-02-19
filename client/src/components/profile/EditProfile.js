import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import ImageCropper from './ImageCropper';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    bio: '',
    profile_picture: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        
        const response = await api.get(`/users/${currentUser.id}`);
        setFormData({
          bio: response.data.bio || '',
          profile_picture: response.data.profile_picture || ''
        });
        setError(null);
      } catch (err) {
        const errorMessage = err.response?.data?.details || err.response?.data?.message || 'Failed to fetch profile';
        setError(errorMessage);
        if (!err.response) {
          console.error('Network error:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchProfile();
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return; // Prevent double submission
    
    setError(null);
    setIsSaving(true);

    try {
      // Validate we have an image
      if (!formData.profile_picture) {
        setError('No profile picture selected');
        setIsSaving(false);
        return;
      }
      const imageData = formData.profile_picture.includes('data:image')
        ? formData.profile_picture.split(',')[1]
        : formData.profile_picture;

      const response = await api.put(`/users/${currentUser.id}`, { 
        ...formData, 
        profile_picture: imageData 
      });

      if (response?.data?.message) {
        // Optional: Show success message
        console.log(response.data.message);
      }

      navigate(`/profile/${currentUser.id}`);
    } catch (err) {
      const errorMessage = err.response?.data?.details || err.response?.data?.message || 'Error updating profile';
      console.error('Profile update error:', {
        error: err,
        response: err.response
      });
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading profile data...</div>;
  }

  const handleImageCropped = (croppedImage) => {
    setFormData({
      ...formData,
      profile_picture: croppedImage
    });
  };

  return currentUser ? (
    <div className="edit-profile-container">
      <h2 style={{ marginBottom: '20px' }}>Edit Profile</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            rows="4"
          />
        </div>

        <div className="profile-picture-section">
          <h3>Profile Picture</h3>
          <ImageCropper
            onImageCropped={handleImageCropped}
            currentImage={formData.profile_picture}
            placeholder="Enter URL for profile picture"
          />
        </div>
        <div className="form-actions">
          <button 
            type="submit" 
            className="save-btn"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate(`/profile/${currentUser.id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  ) : (
    <div>Please log in to edit your profile.</div>
  );
};

export default EditProfile;
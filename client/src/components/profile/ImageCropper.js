import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropper = ({ onImageCropped, currentImage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [crop, setCrop] = useState({
    aspect: 1,
    unit: 'px',
    x: 0,
    y: 0,
    width: 100,
    height: 100
  });
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG or PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be smaller than 5MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      // Reset crop when new image is loaded
      setCrop({
        aspect: 1,
        unit: 'px',
        x: 0,
        y: 0,
        width: 100,
        height: 100
      });
    };
    reader.readAsDataURL(file);
    setCroppedPreview(null);
    setError('');
  };

  const handleCropComplete = async (crop) => {
    setIsProcessing(true);
    setError('');

    if (!imgRef.current || !crop.width || !crop.height) {
      setError('Please select an area to crop');
      setIsProcessing(false);
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = 400;
      canvas.height = 400;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        400,
        400
      );

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // Validate cropped image size
      const base64str = croppedDataUrl.split(',')[1];
      const decoded = atob(base64str);
      if (decoded.length > 5 * 1024 * 1024) {
        throw new Error('Cropped image is too large. Please try a smaller selection.');
      }

      setCroppedPreview(croppedDataUrl);
      onImageCropped(croppedDataUrl);
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (err) {
      setError(err.message || 'Failed to process cropped image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCroppedPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3>Profile Picture Requirements:</h3>
        <ul>
          <li>Maximum size: 5MB</li>
          <li>Allowed formats: JPEG, PNG</li>
          <li>Will be cropped to a square</li>
        </ul>
      </div>

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileSelect}
          style={{ marginBottom: '20px' }}
        />
        {error && (
          <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee' }}>
            {error}
          </div>
        )}
      </div>

      {previewUrl && !croppedPreview && (
        <div>
          <ReactCrop
            src={previewUrl}
            onImageLoad={(img) => { imgRef.current = img; }}
            crop={crop}
            onChange={setCrop}
            style={{ maxHeight: '500px' }}
          />
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={() => handleCropComplete(crop)}
              disabled={isProcessing}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginRight: '10px',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                opacity: isProcessing ? 0.7 : 1
              }}
            >
              {isProcessing ? 'Processing...' : 'Apply Crop'}
            </button>
            <button 
              onClick={handleReset}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {croppedPreview && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h4>Preview</h4>
          <img 
            src={croppedPreview} 
            alt="Cropped preview" 
            style={{ 
              maxWidth: '200px', 
              maxHeight: '200px',
              borderRadius: '4px',
              border: '2px solid #4CAF50'
            }} 
          />
          <button 
            onClick={handleReset}
            style={{ 
              display: 'block', 
              margin: '10px auto',
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Choose Different Image
          </button>
        </div>
      )}

      {!previewUrl && !croppedPreview && currentImage && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h4>Current Profile Picture</h4>
          <img 
            src={currentImage} 
            alt="Current profile" 
            style={{ 
              maxWidth: '200px', 
              maxHeight: '200px',
              borderRadius: '4px'
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
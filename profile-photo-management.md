# Profile Photo Management System Documentation

## Overview
This document outlines how our Forum application handles profile photo management, from initial upload through storage and editing. The system is built using React for the frontend and Node.js/Express for the backend, with image processing handled by the Sharp library.

## Frontend Implementation

### Components Structure

1. **EditProfile Component** (`client/src/components/profile/EditProfile.js`)
   - Main container for profile editing
   - Manages form state and API communication
   - Handles both bio text and profile picture updates
   ```javascript
   const [formData, setFormData] = useState({
     bio: '',
     profile_picture: ''
   });
   ```

2. **ImageCropper Component** (`client/src/components/profile/ImageCropper.js`)
   - Handles image selection and cropping
   - Uses react-image-crop for interactive cropping
   - Enforces image requirements:
     - Maximum size: 5MB
     - Allowed formats: JPEG, PNG
     - Square aspect ratio (1:1)
   ```javascript
   const [crop, setCrop] = useState({
     x: 0,
     y: 0,
     aspect: 1,
     width: 100,
     unit: 'px'
   });
   ```

### Image Processing Flow (Frontend)

1. **File Selection**
   ```javascript
   const handleFileSelect = (event) => {
     const file = event.target.files[0];
     // Validate file type and size
     if (!file.type.startsWith('image/')) {
       setError('Please select a valid image file (JPEG or PNG)');
       return;
     }
     if (file.size > 5 * 1024 * 1024) {
       setError('Image size must be smaller than 5MB');
       return;
     }
   };
   ```

2. **Image Cropping**
   - Uses HTML5 Canvas for image manipulation
   - Converts cropped image to base64 format
   - Standard size: 400x400 pixels
   ```javascript
   const handleCropComplete = async (crop) => {
     const canvas = document.createElement('canvas');
     canvas.width = 400;
     canvas.height = 400;
     // Draw cropped image on canvas
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
   };
   ```

3. **API Communication** (`client/src/services/api.js`)
   - Handles authentication and file upload
   - Automatically includes JWT token in requests
   ```javascript
   const api = axios.create({
     baseURL: '/api'
   });
   
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     if (typeof config.data === 'object') {
       config.headers['Content-Type'] = 'application/json';
     }
     return config;
   });
   ```

## Backend Implementation

### Routes and Controllers

1. **User Routes** (`backend/routes/users.js`)
   - Handles profile update requests
   - Validates user authentication
   - Processes image data
   ```javascript
   router.put('/:id', auth, async (req, res) => {
     try {
       const { bio, profile_picture: base64Image } = req.body;
       // Process and save profile updates
       if (base64Image) {
         const imagePath = await processProfileImage(base64Image, user.id);
         user.profile_picture = imagePath;
       }
     } catch (err) {
       res.status(400).json({ 
         message: 'Error updating profile', 
         details: err.message 
       });
     }
   });
   ```

### Image Processing (`backend/utils/imageProcessor.js`)

1. **Image Processing Steps**
   - Converts base64 to buffer
   - Processes image using Sharp
   - Saves to filesystem
   ```javascript
   const processProfileImage = async (base64Data, userId) => {
     // Convert base64 to buffer
     const imageBuffer = Buffer.from(base64Data, 'base64');
     
     // Process with Sharp
     const processedImage = await sharp(imageBuffer)
       .resize(400, 400, {
         fit: 'cover',
         position: 'center'
       })
       .jpeg({ quality: 90 })
       .toBuffer();
   };
   ```

2. **File Management**
   - Generates unique filenames using userId and timestamp
   - Cleans up old profile pictures
   - Sets proper file permissions
   ```javascript
   // File naming convention
   const filename = `profile_${userId}_${Date.now()}.jpg`;
   
   // Directory management
   await fs.mkdir(uploadDir, { recursive: true, mode: 0o755 });
   
   // File saving with permissions
   await fs.writeFile(filePath, processedImage, { mode: 0o644 });
   ```

### Storage Structure

1. **File System Storage**
   - Location: `backend/uploads/profiles/`
   - Naming format: `profile_[userId]_[timestamp].jpg`
   - File permissions: 644 (rw-r--r--)
   - Directory permissions: 755 (rwxr-xr-x)

2. **Database Storage** (`backend/models/User.js`)
   - Stores file path in user model
   - References image location relative to uploads directory
   ```javascript
   {
     profile_picture: {
       type: String,
       default: ''
     }
   }
   ```

## Error Handling

1. **Frontend Validation**
   - File type checking
   - Size limitations
   - Image dimension requirements
   - Loading and processing states

2. **Backend Validation**
   - Authentication verification
   - File system access
   - Image processing errors
   - Database update errors

## Security Measures

1. **Authentication**
   - JWT token required for profile updates
   - User can only modify their own profile

2. **File Security**
   - Proper file permissions
   - Sanitized file names
   - Size limitations
   - Type restrictions

3. **Error Prevention**
   - Old file cleanup
   - Proper error handling
   - Validation at multiple levels

## Areas for Improvement

1. **Image Optimization**
   - Implement progressive loading
   - Add WebP format support
   - Consider CDN integration

2. **Error Handling**
   - Add retry mechanism for failed uploads
   - Implement better error reporting
   - Add upload progress indication

3. **Storage Management**
   - Implement periodic cleanup of unused files
   - Add file versioning
   - Consider cloud storage integration

## Known Issues and Debugging Guide

### Console Warnings and Errors

1. **React Router Future Flag Warnings**
   ```
   ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7...
   ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7...
   ```
   - These are non-breaking warnings about upcoming changes in React Router v7
   - **Solution**: Can be resolved by adding future flags to router configuration:
   ```javascript
   const router = createBrowserRouter(
     [
       // route definitions
     ],
     {
       future: {
         v7_startTransition: true,
         v7_relativeSplatPath: true
       }
     }
   );
   ```

2. **Image Cropping SVG Errors**
   ```
   Error: <rect> attribute height: Expected length, "undefinedpx"
   ```
   - Occurs when crop dimensions become undefined during image cropping
   - Common in the ImageCropper component when handling crop state

   **Current Implementation**
   ```javascript
   const [crop, setCrop] = useState({
     x: 0,
     y: 0,
     aspect: 1,
     width: 100,
     unit: 'px'
   });
   ```

   **Recommended Fix**
   ```javascript
   const [crop, setCrop] = useState({
     x: 0,
     y: 0,
     width: 100,
     height: 100,  // Ensure height is defined
     unit: 'px',
     aspect: 1
   });

   // Add validation in crop change handler
   const handleCropChange = (newCrop) => {
     if (typeof newCrop.width !== 'undefined' && typeof newCrop.height !== 'undefined') {
       setCrop(newCrop);
     }
   };
   ```

### Troubleshooting Steps

1. **Image Upload Issues**
   - Check browser console for file size and type validation errors
   - Verify network requests in browser dev tools
   - Confirm proper JWT token in request headers
   - Check server logs for processing errors

2. **Image Processing Failures**
   - Verify Sharp library installation and version
   - Check file permissions in uploads directory
   - Monitor server memory usage during processing
   - Validate input image format and dimensions

3. **Storage Issues**
   - Check disk space availability
   - Verify file paths and permissions
   - Monitor for orphaned files
   - Check database consistency with stored files
# Profile Photo Editing Fix Plan

## Current Issues

### Frontend Issues
1. Base64 Image Data Handling
   - Problem: EditProfile component incorrectly splits base64 image data
   - Current: `profile_picture: formData.profile_picture.split(',')[1]`
   - This assumes the data URL prefix is always present, which may not be true

2. Image Validation
   - No validation of cropped image output in ImageCropper
   - No visual feedback during image processing
   - Incomplete error handling for failed uploads

3. User Experience
   - No loading state during image upload
   - No preview of the cropped image before saving
   - No feedback on upload progress

### Backend Issues
1. File Management
   - No cleanup of old profile pictures when new ones are uploaded
   - Potential disk space issues over time
   - No validation of upload directory permissions

2. Image Processing
   - No server-side file size validation
   - No validation of image dimensions
   - No handling of corrupt image data

3. Error Handling
   - Basic error messages that don't provide specific details
   - No proper cleanup on failed uploads
   - No logging of image processing errors

## Solution Plan

### Frontend Changes

1. EditProfile.js Updates
   ```javascript
   // Modify image submission
   const handleSubmit = async (e) => {
     e.preventDefault();
     setError(null);
     setLoading(true);
     
     try {
       const imageData = formData.profile_picture.includes('data:image') 
         ? formData.profile_picture.split(',')[1]
         : formData.profile_picture;
         
       await api.put(`/users/${currentUser.id}`, { 
         ...formData, 
         profile_picture: imageData 
       });
       navigate(`/profile/${currentUser.id}`);
     } catch (err) {
       setError(err.response?.data?.message || 'Error updating profile');
     } finally {
       setLoading(false);
     }
   };
   ```

2. ImageCropper.js Improvements
   - Add loading state during crop processing
   - Validate cropped image dimensions
   - Add preview of final cropped image
   - Improve error messaging

### Backend Changes

1. Image Processor Updates
   ```javascript
   const processProfileImage = async (base64Data, userId) => {
     try {
       // Validate input
       if (!base64Data) {
         throw new Error('No image data provided');
       }

       // Clean up old profile picture
       const user = await User.findByPk(userId);
       if (user.profile_picture) {
         const oldPath = path.join(__dirname, '..', user.profile_picture);
         await fs.unlink(oldPath).catch(() => {});
       }

       // Process new image
       const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
       const imageBuffer = Buffer.from(base64Image, 'base64');

       // Validate file size (5MB limit)
       if (imageBuffer.length > 5 * 1024 * 1024) {
         throw new Error('Image file too large');
       }

       // Process image
       const processedImage = await sharp(imageBuffer)
         .resize(400, 400, {
           fit: 'cover',
           position: 'center'
         })
         .jpeg({ quality: 90 })
         .toBuffer();

       // Save with error handling
       const filename = `profile_${userId}_${Date.now()}.jpg`;
       const uploadDir = path.join(__dirname, '../uploads/profiles');
       const filePath = path.join(uploadDir, filename);

       await fs.mkdir(uploadDir, { recursive: true });
       await fs.writeFile(filePath, processedImage);

       return `/uploads/profiles/${filename}`;
     } catch (error) {
       console.error('Error processing image:', error);
       throw new Error(`Failed to process image: ${error.message}`);
     }
   };
   ```

2. User Routes Enhancement
   ```javascript
   router.put('/:id', auth, async (req, res) => {
     try {
       const { bio, profile_picture: base64Image } = req.body;
       const user = await User.findByPk(req.params.id);
       
       if (!user) {
         return res.status(404).json({ message: 'User not found' });
       }

       if (user.id !== req.user.id) {
         return res.status(403).json({ message: 'Not authorized' });
       }

       user.bio = bio || user.bio;
       
       if (base64Image) {
         try {
           const imagePath = await processProfileImage(base64Image, user.id);
           user.profile_picture = imagePath;
         } catch (imageError) {
           return res.status(400).json({ 
             message: 'Error processing image', 
             error: imageError.message 
           });
         }
       }
       
       await user.save();
       res.json(user);
     } catch (err) {
       res.status(500).json({ 
         message: 'Error updating profile', 
         error: err.message 
       });
     }
   });
   ```

## Implementation Steps

1. Backend Updates
   - [ ] Update imageProcessor.js with new validation and cleanup
   - [ ] Modify users route with enhanced error handling
   - [ ] Add logging for image processing errors
   - [ ] Test upload directory permissions

2. Frontend Updates
   - [ ] Fix base64 image handling in EditProfile
   - [ ] Add loading states and progress indicators
   - [ ] Improve error messaging and user feedback
   - [ ] Add image preview functionality

3. Testing
   - [ ] Test with various image sizes and formats
   - [ ] Verify old image cleanup
   - [ ] Test error scenarios
   - [ ] Validate user experience improvements

## Success Criteria
- Profile pictures can be successfully uploaded and cropped
- Old profile pictures are cleaned up
- Users receive clear feedback during the process
- Error messages are specific and helpful
- Image processing is reliable and efficient
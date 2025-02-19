const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { User } = require('../models');

const processProfileImage = async (base64Data, userId) => {
  console.log(`Processing profile image for user ${userId}`);
  try {
    // Validate input
    if (!base64Data) {
      throw new Error('No image data provided');
    }

    // Clean up old profile picture
    const user = await User.findByPk(userId);
    if (user?.profile_picture) {
      console.log(`Found existing profile picture: ${user.profile_picture}`);
      const oldPath = path.join(__dirname, '..', user.profile_picture);
      try {
        await fs.access(oldPath);
        await fs.unlink(oldPath);
      } catch (err) {
        console.log(`No existing profile picture found at ${oldPath}`);
      }
    }

    // Remove the data URL prefix if present
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
    
    console.log('Converting base64 to buffer...');
    let imageBuffer;
    try {
      imageBuffer = Buffer.from(base64Image, 'base64');
    } catch (err) {
      throw new Error('Invalid image data format');
    }

    // Validate file size (5MB limit)
    if (imageBuffer.length > 5 * 1024 * 1024) {
      throw new Error('Image file too large (max 5MB)');
    }

    console.log('Processing image with Sharp...');
    // Process image with sharp
    let processedImage;
    try {
      processedImage = await sharp(imageBuffer)
        .resize(400, 400, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 90 })
        .toBuffer();
    } catch (err) {
      throw new Error('Failed to process image: Invalid image format');
    }

    // Create filename and path
    console.log('Saving processed image...');
    const filename = `profile_${userId}_${Date.now()}.jpg`;
    const uploadDir = path.join(__dirname, '../uploads/profiles');
    const filePath = path.join(uploadDir, filename);

    try {
      // Ensure upload directory exists with proper permissions
      await fs.mkdir(uploadDir, { recursive: true, mode: 0o755 });
      
      // Save the processed image file
      await fs.writeFile(filePath, processedImage, { mode: 0o644 });
    } catch (err) {
      throw new Error(`Failed to save image: ${err.message}`);
    }

    console.log('Profile image processing completed successfully');
    return `/uploads/profiles/${filename}`;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error(error.message || 'Failed to process image');
  }
};

module.exports = {
  processProfileImage
};
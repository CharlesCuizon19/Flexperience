// routes/uploadRoutes.js

const express = require('express');
const { upload, handleFileUpload, uploadToSupabase } = require('../middlewares/multer'); // Import multer and the Supabase upload handler
const router = express.Router();

// Endpoint to handle multiple file uploads
router.post('/upload', upload.fields([
  { name: 'business_permit', maxCount: 1 },
  { name: 'gym_logo', maxCount: 1 },
  { name: 'gym_photos', maxCount: 10 }  // Allow up to 10 photos
]), async (req, res) => {
  try {
    if (req.files) {
      const fileUrls = {};

      // Upload business permit and gym logo
      const businessPermitFile = req.files['business_permit'] ? req.files['business_permit'][0] : null;
      const gymLogoFile = req.files['gym_logo'] ? req.files['gym_logo'][0] : null;
      const gymPhotos = req.files['gym_photos'] || [];

      if (businessPermitFile) {
        fileUrls.business_permit = await handleFileUpload(businessPermitFile);
      }
      if (gymLogoFile) {
        fileUrls.gym_logo = await handleFileUpload(gymLogoFile);
      }

      // Upload gym photos
      const gymPhotoUrls = [];
      for (const photo of gymPhotos) {
        const photoUrl = await handleFileUpload(photo);
        gymPhotoUrls.push(photoUrl);
      }
      fileUrls.gym_photos = gymPhotoUrls;

      // Respond with JSON data containing the URLs of uploaded files
      res.json(fileUrls);
    } else {
      res.status(400).json({ error: 'No files were uploaded' });
    }
  } catch (error) {
    console.error("File upload error:", error);  // Log the detailed error
    res.status(500).json({ error: 'File upload to Supabase failed', details: error.message });
  }
});


// Endpoint to handle single file upload
router.post('/uploadSingle', upload.single('file'), async (req, res) => {
  console.log("Received file:", req.file); // Log the file to confirm

  try {
    if (req.file) {
      // Use handleFileUpload for single file upload
      const fileUrl = await handleFileUpload(req.file);

      // Respond with the file URL and original filename
      res.json({ fileUrl, fileName: req.file.originalname });
    } else {
      res.status(400).json({ error: 'File upload failed: No file received' });
    }
  } catch (error) {
    console.error("Error in uploadSingle route:", error.message);
    res.status(500).json({ error: 'File upload to Supabase failed', details: error.message });
  }
});




module.exports = router;

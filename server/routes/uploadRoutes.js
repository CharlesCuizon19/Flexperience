// routes/uploadRoutes.js

const express = require('express');
const { upload, handleFileUpload, uploadToSupabase  } = require('../middlewares/multer'); // Import multer and the Supabase upload handler
const router = express.Router();

// Endpoint to handle multiple file uploads
router.post('/upload', upload.fields([{ name: 'business_permit', maxCount: 1 }, { name: 'gym_logo', maxCount: 1 }]), async (req, res) => {
  try {
    if (req.files) {
      const fileUrls = {};

      // Loop through each file field and upload to Supabase
      for (const fieldName in req.files) {
        const file = req.files[fieldName][0]; // Get the first file from each field
        fileUrls[fieldName] = await handleFileUpload(file); // Upload and get the URL
      }

      // Respond with JSON data containing the URLs of uploaded files
      res.json(fileUrls);
    } else {
      res.status(400).json({ error: 'No files were uploaded' });
    }
  } catch (error) {
    res.status(500).json({ error: 'File upload to Supabase failed', details: error.message });
  }
});

// Endpoint to handle single file upload
router.post('/uploadSingle', upload.single('file'), async (req, res) => {
  console.log("Received file:", req.file); // Log the file to confirm

  try {
    if (req.file) {
      const fileUrl = await uploadToSupabase(req.file); // File upload function that returns URL
      const fileName = req.file.originalname; // You can also return the original file name if needed
      res.json({ fileUrl, fileName }); // Return both the file URL and filename
    } else {
      res.status(400).json({ error: 'File upload failed: No file received' });
    }
  } catch (error) {
    console.error("Error in uploadSingle route:", error.message);
    res.status(500).json({ error: 'File upload to Supabase failed', details: error.message });
  }
});



module.exports = router;

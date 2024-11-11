// middlewares/multer.js

const multer = require('multer');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://svzdiwldgosxswszgale.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2emRpd2xkZ29zeHN3c3pnYWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyOTg3MjcsImV4cCI6MjA0Njg3NDcyN30.MN9hZ__WElKvhYjroJAqnsBS-LEqiqJKtvSP4nFDmpE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToSupabase = async (file) => {
  const supabase = createClient(supabaseUrl, supabaseKey); // Initialize Supabase client

  // Upload the file to the 'uploads' bucket in Supabase storage
  const { data, error } = await supabase.storage
    .from('uploads') // Replace with your bucket name
    .upload('public/' + file.originalname, file.buffer, {
      cacheControl: '3600',
      upsert: false, // Optionally, you can set this to true to overwrite existing files
    });

  if (error) {
    throw new Error('Failed to upload file: ' + error.message);
  }

  // The stored file's name will be available in `data.path`
  return data.path; // Return the path or filename stored in Supabase
};



// Middleware to handle file upload
const handleFileUpload = async (file) => {
  if (!file) throw new Error('No file to upload');

  try {
    const fileUrl = await uploadToSupabase(file);
    return fileUrl; // Return the file URL for later use
  } catch (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};



module.exports = { upload, handleFileUpload, uploadToSupabase  };

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
const { v4: uuidv4 } = require('uuid');

const uploadToSupabase = async (file) => {
  const supabase = createClient(supabaseUrl, supabaseKey); // Initialize Supabase client

  // Generate a unique filename using UUID to prevent overwriting
  const uniqueFilename = uuidv4() + '-' + file.originalname;

  // Upload the file to the 'public' bucket without the '/uploads' folder
  const { data, error } = await supabase.storage
    .from('public') // Specify the 'public' bucket directly (no /uploads prefix)
    .upload(uniqueFilename, file.buffer, { // Upload directly under 'public'
      cacheControl: '3600',
      upsert: false, // Ensure we don't overwrite existing files
    });

  if (error) {
    throw new Error('Failed to upload file: ' + error.message);
  }

  // The stored file's name will be available in `data.path`
  return data.path; // Return the path or filename stored in Supabase
};



// Middleware to handle file upload
const handleFileUpload = async (file) => {
  try {
    // Generate a unique filename using UUID
    const uniqueFilename = uuidv4() + '-' + file.originalname;

    // Upload the file to the 'public' bucket
    const { data, error } = await supabase.storage
      .from('uploads') // Ensure this matches your bucket name
      .upload(uniqueFilename, file.buffer, {
        cacheControl: '3600',
        upsert: false, // Prevent overwriting existing files
      });

    if (error) {
      throw new Error('Failed to upload file: ' + error.message);
    }

    return data.path; // Return the path of the uploaded file
  } catch (error) {
    throw new Error('Error uploading to Supabase: ' + error.message);
  }
};





module.exports = { upload, handleFileUpload, uploadToSupabase };

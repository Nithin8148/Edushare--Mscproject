const fs = require('fs');
const path = require('path');
const multer = require('multer');
const pool = require('../config/database'); // Adjust the path to your database config

// Configure Multer for file storage and filtering
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  }
});

// File filter to accept only PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only PDF files are allowed'), false); // Reject the file
  }
};

const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB (optional)
});

async function handleFileUpload(req, res) {
  // Middleware for handling file upload
  upload.single('file')(req, res, async (err) => {
    if (err) {
      if (err.message === 'Only PDF files are allowed') {
        return res.status(400).json({ message: 'Only PDF files are allowed' });
      }
      console.error('Multer error:', err);
      return res.status(500).json({ message: 'Error during file upload' });
    }

    const file = req.file;
    const { userID, subject, type } = req.body;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Ensure all required parameters are provided
    if (!userID || !subject || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      // Insert file metadata into the database
      const [result] = await pool.execute(
        'INSERT INTO books (userID, filename, filepath, subject, type) VALUES (?, ?, ?, ?, ?)',
        [userID, file.originalname, `/uploads/${file.filename}`, subject, type]
      );
      res.status(200).json({ message: 'File uploaded successfully', fileId: result.insertId });
    } catch (error) {
      console.error('Error during file upload:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}

module.exports = handleFileUpload;

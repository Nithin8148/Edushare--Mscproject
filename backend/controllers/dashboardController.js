const db = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.userId}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

exports.uploadProfilePicture = [
  upload.single('profilePicture'),
  async (req, res) => {
    try {
      const filePath = req.file.path.replace(/\\/g, '/'); // Ensure the path is URL-friendly
      await db.execute('UPDATE users SET profile_picture = ? WHERE id = ?', [filePath, req.userId]);
      res.status(200).json({ message: 'Profile picture updated successfully', filePath });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading profile picture' });
    }
  }
];


exports.removeProfilePicture = async (req, res) => {
  try {
    const [user] = await db.execute('SELECT profile_picture FROM users WHERE id = ?', [req.userId]);
    const filePath = user[0].profile_picture;

    if (filePath) {
      fs.unlinkSync(filePath);
      await db.execute('UPDATE users SET profile_picture = NULL WHERE id = ?', [req.userId]);
      res.status(200).json({ message: 'Profile picture removed successfully' });
    } else {
      res.status(400).json({ message: 'No profile picture to remove' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error removing profile picture' });
  }
};

exports.uploadDocument = async (req, res) => {
  const { name, description } = req.body;
  const filePath = req.file.path.replace(/\\/g, '/');

  try {
    const [result] = await db.execute(
      'INSERT INTO products (name, description, file_path, user_id) VALUES (?, ?, ?, ?)',
      [name, description, filePath, req.userId]
    );
    res.status(201).json({ message: 'Document uploaded successfully', documentId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading document' });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const [documents] = await db.execute('SELECT * FROM documents WHERE user_id = ?', [req.userId]);
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM documents WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document' });
  }
};


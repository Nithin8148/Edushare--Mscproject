const pool = require('../config/database'); // Adjust the path to your database config

// Function to get all books
async function getAllBooks(req, res) {
  try {
    const [rows] = await pool.execute('SELECT * FROM books');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getAllBooks;

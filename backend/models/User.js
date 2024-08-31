const pool = require('../config/database'); // Adjust the path to where your pool is defined

async function createUsersTable() {
  try {
    const connection = await pool.getConnection();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.execute(createTableQuery);
    console.log('Users table created or already exists.');
    connection.release();
  } catch (error) {
    console.error('Error creating users table:', error);
  }
}

// Call the function to create the table
createUsersTable();

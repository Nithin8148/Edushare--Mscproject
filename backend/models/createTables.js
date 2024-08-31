const pool = require('../config/database'); // Adjust the path to where your pool is defined

async function createUsersTable() {
  try {
    const connection = await pool.getConnection();
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          downloaded_files TEXT
        )
      `;
    await connection.execute(createTableQuery);
    console.log('Users table created or already exists.');
    connection.release();
  } catch (error) {
    console.error('Error creating users table:', error);
  }
}

async function createProductsTable() {
  try {
    const connection = await pool.getConnection();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userID INT NOT NULL,
        filename VARCHAR(255) NOT NULL,
        filepath TEXT NOT NULL,
        subject VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.execute(createTableQuery);
    console.log('Products table created or already exists.');
    connection.release();
  } catch (error) {
    console.error('Error creating products table:', error);
  }
}

async function createTables() {
  await createUsersTable();
  await createProductsTable();
}

// Export the function to be used in server startup
module.exports = createTables;
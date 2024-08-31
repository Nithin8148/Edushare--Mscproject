// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   category: {
//     type: String,
//     required: true
//   },
//   inStock: {
//     type: Boolean,
//     default: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;
const pool = require('../config/database'); // Adjust the path to where your pool is defined

async function createProductsTable() {
  try {
    const connection = await pool.getConnection();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
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

// Call the function to create the table
createProductsTable();
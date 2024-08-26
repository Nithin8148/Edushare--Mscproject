const multer = require('multer');
const path = require('path');
const db = require('../config/database');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

exports.addProduct = [
    upload.single('productFile'),
    async (req, res) => {
        const { originalname, filename, path: filePath } = req.file;
        const { name, description, type } = req.body;

        try {
            const [result] = await db.execute(
                'INSERT INTO products (name, description, type, image_url, user_id) VALUES (?, ?, ?, ?, ?)',
                [name || originalname, description || '', type || 'other', filePath.replace(/\\/g, '/'), req.userId]
            );
            res.status(201).json({ message: 'Product created', productId: result.insertId, filePath: `/uploads/${filename}`, productName: name || originalname });
        } catch (error) {
            res.status(500).json({ message: 'Error creating product' });
        }
    }
];


exports.createProduct = async (req, res) => {
  const { name, description, type, imageUrl } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO products (name, description, type, image_url, user_id) VALUES (?, ?, ?, ?, ?)',
      [name, description, type, imageUrl, req.userId]
    );
    res.status(201).json({ message: 'Product created', productId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products WHERE user_id = ?', [req.userId]);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(products[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

exports.updateProduct = async (req, res) => {
  const { name, description, type, imageUrl } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE products SET name = ?, description = ?, type = ?, image_url = ? WHERE id = ? AND user_id = ?',
      [name, description, type, imageUrl, req.params.id, req.userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM products WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};


  
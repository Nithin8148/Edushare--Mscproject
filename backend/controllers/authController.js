const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)', 
      [firstName, lastName, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error during registration' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt with email:', email);

    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      console.log('User not found');
      return res.status(401).json({ message: 'Auth failed' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('User query result:', rows);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Auth failed' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Generated token:', token);

    res.status(200).json({ token });
  } catch (error) {
    console.log('Error during login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

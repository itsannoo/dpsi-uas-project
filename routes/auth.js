const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticate, authorize } = require('../middleware/auth');
const { getDb } = require('../models/index');
const router = express.Router();

// Rute pendaftaran user
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validasi input
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required' });
    }

    const db = getDb();

    // Cek apakah username sudah ada
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = { username, password: hashedPassword, role };
    await db.collection('users').insertOne(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// Rute login user
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Validasi input
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      const db = getDb();
  
      // Cek user dan verifikasi password
      const user = await db.collection('users').findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Buat token JWT
      const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '24h' });
      res.json({ token });
    } catch (err) {
      console.error('Error logging in user:', err);
      res.status(500).json({ message: 'Failed to login user' });
    }
  });
  
// Rute mendapatkan semua pengguna
router.get('/users', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const db = getDb();
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

module.exports = router;

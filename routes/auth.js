const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');  

// Register
router.post('/register', async (req, res) => {
    const { id_user, nama, alamat, nomor_telepon, email, username, password, id_bank, role } = req.body;

    try {
        console.log('Connecting to DB...');
        const db = req.db;
        const usersCollection = db.collection('users');
    
        // Check if user exists
        console.log('Checking if user exists...');
        let user = await usersCollection.findOne({ email });
        if (user) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }
    
        // Encrypt password
        console.log('Encrypting password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Create new user
        console.log('Creating new user...');
        user = {
            id_user,
            nama,
            alamat,
            nomor_telepon,
            email,
            username,
            password: hashedPassword,
            id_bank,
            role
        };
    
        // Save user
        console.log('Saving user...');
        await usersCollection.insertOne(user);
    
        res.json({ message: 'User registered successfully' });
    
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).json({ message: 'Server error' });
    }    
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = req.db;
        const usersCollection = db.collection('users');
    
        // Check if user exists
        let user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    
        // Create token
        const payload = { user: { id: user.id_user, role: user.role } };
        jwt.sign(payload, 'your_jwt_secret', { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
    
});

module.exports = router;

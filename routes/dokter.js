const express = require('express');
const router = express.Router();
const Dokter = require('../models/dokterschema');
const { authenticate, authorize } = require('../middleware/auth');

// Get all dokters
router.get('/', authenticate, async (req, res) => {
    try {
        const dokters = await Dokter.find();
        res.json(dokters);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific dokter by id
router.get('/:id', authenticate, async (req, res) => {
    try {
        const dokter = await Dokter.findOne({ id_dokter: req.params.id });
        if (!dokter) {
            return res.status(404).json({ message: 'Dokter not found' });
        }
        res.json(dokter);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new dokter
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    const newDokter = new Dokter(req.body);
    try {
        const dokter = await newDokter.save();
        res.status(201).json(dokter);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a dokter by id
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const dokter = await Dokter.findOneAndUpdate({ id_dokter: req.params.id }, req.body, { new: true, runValidators: true });
        if (!dokter) {
            return res.status(404).json({ message: 'Dokter not found' });
        }
        res.json(dokter);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a dokter by id
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const dokter = await Dokter.findOneAndDelete({ id_dokter: req.params.id });
        if (!dokter) {
            return res.status(404).json({ message: 'Dokter not found' });
        }
        res.json({ message: 'Dokter deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Konsultasi = require('../models/konsultasischema');
const { authenticate, authorize } = require('../middleware/auth');

// Get all konsultasis
router.get('/', authenticate, (req, res) => {
    Konsultasi.find()
        .then(konsultasis => res.json(konsultasis))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Get a specific konsultasi by id
router.get('/:id', authenticate, (req, res) => {
    Konsultasi.findOne({ id_konsultasi: req.params.id })
        .then(konsultasi => {
            if (!konsultasi) {
                return res.status(404).json({ message: 'Konsultasi not found' });
            }
            res.json(konsultasi);
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

// Create a new konsultasi
router.post('/', authenticate, authorize(['admin', 'dokter']), (req, res) => {
    const newKonsultasi = new Konsultasi(req.body);
    newKonsultasi.save()
        .then(konsultasi => res.status(201).json(konsultasi))
        .catch(err => res.status(400).json({ message: err.message }));
});

// Update a konsultasi by id
router.put('/:id', authenticate, authorize(['admin', 'dokter']), (req, res) => {
    Konsultasi.findOneAndUpdate({ id_konsultasi: req.params.id }, req.body, { new: true, runValidators: true })
        .then(konsultasi => {
            if (!konsultasi) {
                return res.status(404).json({ message: 'Konsultasi not found' });
            }
            res.json(konsultasi);
        })
        .catch(err => res.status(400).json({ message: err.message }));
});

// Delete a konsultasi by id
router.delete('/:id', authenticate, authorize(['admin']), (req, res) => {
    Konsultasi.findOneAndDelete({ id_konsultasi: req.params.id })
        .then(konsultasi => {
            if (!konsultasi) {
                return res.status(404).json({ message: 'Konsultasi not found' });
            }
            res.json({ message: 'Konsultasi deleted' });
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;

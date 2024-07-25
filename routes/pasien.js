const express = require('express');
const router = express.Router();
const Pasien = require('../models/pasienschema');
const { authenticate, authorize } = require('../middleware/auth');

// Get all pasiens
router.get('/', authenticate, (req, res) => {
    Pasien.find()
        .then(pasiens => res.json(pasiens))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Get a specific pasien by id
router.get('/:id', authenticate, (req, res) => {
    Pasien.findOne({ id_pasien: req.params.id })
        .then(pasien => {
            if (!pasien) {
                return res.status(404).json({ message: 'Pasien not found' });
            }
            res.json(pasien);
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

// Create a new pasien
router.post('/', authenticate, authorize(['admin']), (req, res) => {
    const newPasien = new Pasien(req.body);
    newPasien.save()
        .then(pasien => res.status(201).json(pasien))
        .catch(err => res.status(400).json({ message: err.message }));
});

// Update a pasien by id
router.put('/:id', authenticate, authorize(['admin']), (req, res) => {
    Pasien.findOneAndUpdate({ id_pasien: req.params.id }, req.body, { new: true, runValidators: true })
        .then(pasien => {
            if (!pasien) {
                return res.status(404).json({ message: 'Pasien not found' });
            }
            res.json(pasien);
        })
        .catch(err => res.status(400).json({ message: err.message }));
});

// Delete a pasien by id
router.delete('/:id', authenticate, authorize(['admin']), (req, res) => {
    Pasien.findOneAndDelete({ id_pasien: req.params.id })
        .then(pasien => {
            if (!pasien) {
                return res.status(404).json({ message: 'Pasien not found' });
            }
            res.json({ message: 'Pasien deleted' });
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;

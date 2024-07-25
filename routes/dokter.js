const express = require('express');
const router = express.Router();
const Dokter = require('../models/dokterschema');
const { authenticate, authorize } = require('../middleware/auth');

// Get all dokters
router.get('/', authenticate, (req, res) => {
    Dokter.find()
        .then(dokters => res.json(dokters))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Get a specific dokter by id
router.get('/:id', authenticate, (req, res) => {
    Dokter.findOne({ id_dokter: req.params.id })
        .then(dokter => {
            if (!dokter) {
                return res.status(404).json({ message: 'Dokter not found' });
            }
            res.json(dokter);
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

// Create a new dokter
router.post('/', authenticate, authorize(['admin']), (req, res) => {
    const newDokter = new Dokter(req.body);
    newDokter.save()
        .then(dokter => res.status(201).json(dokter))
        .catch(err => res.status(400).json({ message: err.message }));
});

// Update a dokter by id
router.put('/:id', authenticate, authorize(['admin']), (req, res) => {
    Dokter.findOneAndUpdate({ id_dokter: req.params.id }, req.body, { new: true, runValidators: true })
        .then(dokter => {
            if (!dokter) {
                return res.status(404).json({ message: 'Dokter not found' });
            }
            res.json(dokter);
        })
        .catch(err => res.status(400).json({ message: err.message }));
});

// Delete a dokter by id
router.delete('/:id', authenticate, authorize(['admin']), (req, res) => {
    Dokter.findOneAndDelete({ id_dokter: req.params.id })
        .then(dokter => {
            if (!dokter) {
                return res.status(404).json({ message: 'Dokter not found' });
            }
            res.json({ message: 'Dokter deleted' });
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;

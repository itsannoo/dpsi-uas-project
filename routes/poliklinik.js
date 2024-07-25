const express = require('express');
const router = express.Router();
const Poliklinik = require('../models/poliklinikschema');
const { authenticate, authorize } = require('../middleware/auth');

// Get all polikliniks
router.get('/', authenticate, (req, res) => {
    Poliklinik.find()
        .then(polikliniks => res.json(polikliniks))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Get a specific poliklinik by id
router.get('/:id', authenticate, (req, res) => {
    Poliklinik.findOne({ id_poliklinik: req.params.id })
        .then(poliklinik => {
            if (!poliklinik) {
                return res.status(404).json({ message: 'Poliklinik not found' });
            }
            res.json(poliklinik);
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

// Create a new poliklinik
router.post('/', authenticate, authorize(['admin']), (req, res) => {
    const newPoliklinik = new Poliklinik(req.body);
    newPoliklinik.save()
        .then(poliklinik => res.status(201).json(poliklinik))
        .catch(err => res.status(400).json({ message: err.message }));
});

// Update a poliklinik by id
router.put('/:id', authenticate, authorize(['admin']), (req, res) => {
    Poliklinik.findOneAndUpdate({ id_poliklinik: req.params.id }, req.body, { new: true, runValidators: true })
        .then(poliklinik => {
            if (!poliklinik) {
                return res.status(404).json({ message: 'Poliklinik not found' });
            }
            res.json(poliklinik);
        })
        .catch(err => res.status(400).json({ message: err.message }));
});

// Delete a poliklinik by id
router.delete('/:id', authenticate, authorize(['admin']), (req, res) => {
    Poliklinik.findOneAndDelete({ id_poliklinik: req.params.id })
        .then(poliklinik => {
            if (!poliklinik) {
                return res.status(404).json({ message: 'Poliklinik not found' });
            }
            res.json({ message: 'Poliklinik deleted' });
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;

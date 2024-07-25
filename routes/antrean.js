const express = require('express');
const router = express.Router();
const Antrean = require('../models/antreanschema');
const { authenticate, authorize } = require('../middleware/auth');

// Get all antreans
router.get('/', authenticate, (req, res) => {
    Antrean.find()
        .then(antreans => res.json(antreans))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Get a specific antrean by id
router.get('/:id', authenticate, (req, res) => {
    Antrean.findOne({ id_antrean: req.params.id })
        .then(antrean => {
            if (!antrean) {
                return res.status(404).json({ message: 'Antrean not found' });
            }
            res.json(antrean);
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

// Create a new antrean
router.post('/', authenticate, authorize(['admin', 'staff']), (req, res) => {
    const newAntrean = new Antrean(req.body);
    newAntrean.save()
        .then(antrean => res.status(201).json(antrean))
        .catch(err => res.status(400).json({ message: err.message }));
});

// Update an antrean by id
router.put('/:id', authenticate, authorize(['admin', 'staff']), (req, res) => {
    Antrean.findOneAndUpdate({ id_antrean: req.params.id }, req.body, { new: true, runValidators: true })
        .then(antrean => {
            if (!antrean) {
                return res.status(404).json({ message: 'Antrean not found' });
            }
            res.json(antrean);
        })
        .catch(err => res.status(400).json({ message: err.message }));
});

// Delete an antrean by id
router.delete('/:id', authenticate, authorize(['admin']), (req, res) => {
    Antrean.findOneAndDelete({ id_antrean: req.params.id })
        .then(antrean => {
            if (!antrean) {
                return res.status(404).json({ message: 'Antrean not found' });
            }
            res.json({ message: 'Antrean deleted' });
        })
        .catch(err => res.status(500).json({ message: err.message })); 
});

module.exports = router;

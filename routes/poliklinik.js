const express = require('express');
const router = express.Router();
const { getDb } = require('../models/index');
const { authenticate, authorize } = require('../middleware/auth');

// Get all polikliniks
router.get('/', authenticate, async (req, res) => {
  try {
    const db = getDb();
    const polikliniks = await db.collection('polikliniks').find().toArray();

    const response = polikliniks.map(poliklinik => {
      const { _id, ...poliklinikWithoutId } = poliklinik;
      return poliklinikWithoutId;
    });

    res.json(response);
  } catch (err) {
    console.error('Error fetching polikliniks:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a specific poliklinik by id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const db = getDb();
    const poliklinik = await db.collection('polikliniks').findOne({ id_poliklinik: parseInt(req.params.id, 10) });
    if (!poliklinik) {
      console.log(`Poliklinik dengan id_poliklinik ${req.params.id} tidak ditemukan`);
      return res.status(404).json({ message: 'Poliklinik tidak ditemukan' });
    }

    const { _id, ...poliklinikWithoutId } = poliklinik;
    res.json(poliklinikWithoutId);
  } catch (err) {
    console.error('Error fetching poliklinik by id:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new poliklinik
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const db = getDb();

    // Validate input
    const { id_poliklinik, nama, jam_buka } = req.body;
    if (!id_poliklinik || !nama || !jam_buka) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if id_poliklinik already exists
    const existingPoliklinik = await db.collection('polikliniks').findOne({ id_poliklinik });
    if (existingPoliklinik) {
      return res.status(400).json({ message: 'id_poliklinik already exists' });
    }

    // Create new poliklinik
    const newPoliklinik = {
      id_poliklinik,
      nama,
      jam_buka
    };

    await db.collection('polikliniks').insertOne(newPoliklinik);
    res.status(201).json(newPoliklinik);
  } catch (err) {
    console.error('Error creating poliklinik:', err);
    res.status(500).json({ message: 'Failed to create poliklinik' });
  }
});

// Update a poliklinik by id
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const db = getDb();
    const poliklinikId = parseInt(req.params.id, 10);
    const updatedPoliklinik = {
      nama: req.body.nama,
      jam_buka: req.body.jam_buka
    };

    console.log(`Mencari poliklinik dengan id_poliklinik: ${poliklinikId}`);
    const poliklinik = await db.collection('polikliniks').findOne({ id_poliklinik: poliklinikId });
    if (!poliklinik) {
      console.log(`Poliklinik dengan id_poliklinik ${poliklinikId} tidak ditemukan`);
      return res.status(404).json({ message: 'Poliklinik tidak ditemukan' });
    }

    const result = await db.collection('polikliniks').findOneAndUpdate(
      { id_poliklinik: poliklinikId },
      { $set: updatedPoliklinik },
      { returnDocument: 'after' }
    );

    if (!result || !result.value) {
      console.log(`Poliklinik dengan id_poliklinik ${poliklinikId} tidak ditemukan`);
      return res.status(404).json({ message: 'Poliklinik tidak ditemukan' });
    }

    const { _id, ...poliklinikWithoutId } = result.value;
    res.json(poliklinikWithoutId);
  } catch (err) {
    console.error('Error updating poliklinik:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a poliklinik by id
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const db = getDb();
    const poliklinikId = parseInt(req.params.id, 10);

    console.log(`Mencari poliklinik dengan id_poliklinik: ${poliklinikId}`);
    const poliklinik = await db.collection('polikliniks').findOne({ id_poliklinik: poliklinikId });
    if (!poliklinik) {
      console.log(`Poliklinik dengan id_poliklinik ${poliklinikId} tidak ditemukan`);
      return res.status(404).json({ message: 'Poliklinik tidak ditemukan' });
    }

    const result = await db.collection('polikliniks').findOneAndDelete({ id_poliklinik: poliklinikId });
    if (!result || !result.value) {
      console.log(`Poliklinik dengan id_poliklinik ${poliklinikId} tidak ditemukan`);
      return res.status(404).json({ message: 'Poliklinik tidak ditemukan' });
    }
    res.json({ message: 'Poliklinik dihapus' });
  } catch (err) {
    console.error('Error deleting poliklinik:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

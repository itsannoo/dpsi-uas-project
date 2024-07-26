const express = require('express');
const router = express.Router();
const { getDb } = require('../models/index');
const { authenticate, authorize } = require('../middleware/auth');

// Get all konsultasis
router.get('/', authenticate, async (req, res) => {
  try {
    const db = getDb();
    const konsultasis = await db.collection('konsultasis').find().toArray();

    const response = konsultasis.map(konsultasi => {
      const { _id, ...konsultasiWithoutId } = konsultasi;
      return konsultasiWithoutId;
    });

    res.json(response);
  } catch (err) {
    console.error('Error fetching konsultasis:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a specific konsultasi by id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const db = getDb();
    const konsultasi = await db.collection('konsultasis').findOne({ id_konsultasi: parseInt(req.params.id, 10) });
    if (!konsultasi) {
      console.log(`Konsultasi dengan id_konsultasi ${req.params.id} tidak ditemukan`);
      return res.status(404).json({ message: 'Konsultasi tidak ditemukan' });
    }

    const { _id, ...konsultasiWithoutId } = konsultasi;
    res.json(konsultasiWithoutId);
  } catch (err) {
    console.error('Error fetching konsultasi by id:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new konsultasi
router.post('/', authenticate, authorize(['admin', 'dokter']), async (req, res) => {
  try {
    const db = getDb();

    const { id_konsultasi, id_pasien, id_dokter, tanggal_konsultasi, jam_konsultasi, diagnosis, resep } = req.body;
    if (!id_konsultasi || !id_pasien || !id_dokter || !tanggal_konsultasi || !jam_konsultasi || !diagnosis || !resep) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingKonsultasi = await db.collection('konsultasis').findOne({ id_konsultasi });
    if (existingKonsultasi) {
      return res.status(400).json({ message: 'id_konsultasi already exists' });
    }

    const newKonsultasi = {
      id_konsultasi,
      id_pasien,
      id_dokter,
      tanggal_konsultasi,
      jam_konsultasi,
      diagnosis,
      resep
    };

    await db.collection('konsultasis').insertOne(newKonsultasi);
    res.status(201).json(newKonsultasi);
  } catch (err) {
    console.error('Error creating konsultasi:', err);
    res.status(500).json({ message: 'Failed to create konsultasi' });
  }
});

// Update a konsultasi by id_konsultasi
router.put('/:id', authenticate, authorize(['admin', 'dokter']), async (req, res) => {
    try {
      const db = getDb();
      const konsultasiId = parseInt(req.params.id, 10);
      const updatedKonsultasi = {
        id_pasien: req.body.id_pasien,
        id_dokter: req.body.id_dokter,
        tanggal_konsultasi: req.body.tanggal_konsultasi,
        jam_konsultasi: req.body.jam_konsultasi,
        diagnosis: req.body.diagnosis,
        resep: req.body.resep
      };
  
      console.log(`Mencari konsultasi dengan id_konsultasi: ${konsultasiId}`);
      const result = await db.collection('konsultasis').findOneAndUpdate(
        { id_konsultasi: konsultasiId },
        { $set: updatedKonsultasi },
        { returnDocument: 'after' }
      );
  
      if (result && result.value) {
        res.status(200).json(result.value);
      } else {
        res.status(404).json({ message: 'Konsultasi tidak ditemukan' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete a konsultasi by id_konsultasi
  router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const db = getDb();
      const konsultasiId = parseInt(req.params.id, 10);
  
      console.log(`Mencari konsultasi dengan id_konsultasi: ${konsultasiId}`);
      const result = await db.collection('konsultasis').findOneAndDelete({ id_konsultasi: konsultasiId });
  
      if (result && result.value) {
        res.json({ message: 'Konsultasi dihapus' });
      } else {
        res.status(404).json({ message: 'Konsultasi tidak ditemukan' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = router;
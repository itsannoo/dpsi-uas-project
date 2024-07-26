const express = require('express');
const router = express.Router();
const { getDb } = require('../models/index');
const { authenticate, authorize } = require('../middleware/auth');

// Get all dokters
router.get('/', authenticate, async (req, res) => {
  try {
    const db = getDb();
    const dokters = await db.collection('dokters').find().toArray();

    // Menghapus field _id dari setiap dokter dalam daftar
    const response = dokters.map(dokter => {
      const { _id, ...dokterWithoutId } = dokter;
      return dokterWithoutId;
    });

    res.json(response);
  } catch (err) {
    console.error('Error fetching dokters:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a specific dokter by id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const db = getDb();
    const dokter = await db.collection('dokters').findOne({ id_dokter: req.params.id });
    if (!dokter) {
      console.log(`Dokter dengan id_dokter ${req.params.id} tidak ditemukan`);
      return res.status(404).json({ message: 'Dokter tidak ditemukan' });
    }

    // Menghapus field _id dari respon
    const { _id, ...dokterWithoutId } = dokter;
    res.json(dokterWithoutId);
  } catch (err) {
    console.error('Error fetching dokter by id:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new dokter
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const db = getDb();

    // Validasi input
    const { id_dokter, nama_dokter, spesialisasi, jam_konsultasi, id_bank } = req.body;
    if (!id_dokter || !nama_dokter || !spesialisasi || !jam_konsultasi || !id_bank) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Cek apakah id_dokter sudah ada
    const existingDokter = await db.collection('dokters').findOne({ id_dokter });
    if (existingDokter) {
      return res.status(400).json({ message: 'id_dokter already exists' });
    }

    // Buat dokter baru
    const newDokter = {
      id_dokter,
      nama_dokter,
      spesialisasi,
      jam_konsultasi,
      id_bank
    };

    await db.collection('dokters').insertOne(newDokter);
    res.status(201).json(newDokter);
  } catch (err) {
    console.error('Error creating dokter:', err);
    res.status(500).json({ message: 'Failed to create dokter' });
  }
});

// Update a dokter by id_dokter
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const db = getDb();
      const updatedDokter = {
        nama_dokter: req.body.nama_dokter,
        spesialisasi: req.body.spesialisasi,
        jam_konsultasi: req.body.jam_konsultasi,
        id_bank: req.body.id_bank // Sesuaikan tipe data jika diperlukan
      };
  
      // Tambahkan log untuk id_dokter yang diterima
      console.log(`Mencari dokter dengan id_dokter: ${req.params.id}`);
  
      const dokter = await db.collection('dokters').findOne({ id_dokter: req.params.id });
      if (!dokter) {
        console.log(`Dokter dengan id_dokter ${req.params.id} tidak ditemukan`);
        return res.status(404).json({ message: 'Dokter tidak ditemukan' });
      }
  
      const result = await db.collection('dokters').findOneAndUpdate(
        { id_dokter: req.params.id },
        { $set: updatedDokter },
        { returnDocument: 'after' }
      );
  
      if (!result || !result.value) {
        console.log(`Dokter dengan id_dokter ${req.params.id} tidak ditemukan`);
        return res.status(404).json({ message: 'Dokter tidak ditemukan' });
      }
  
      const { _id, ...dokterWithoutId } = result.value;
      res.json(dokterWithoutId);
    } catch (err) {
      console.error('Error updating dokter:', err);
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete a dokter by id_dokter
  router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const db = getDb();
  
      // Tambahkan log untuk id_dokter yang diterima
      console.log(`Mencari dokter dengan id_dokter: ${req.params.id}`);
  
      const dokter = await db.collection('dokters').findOne({ id_dokter: req.params.id });
      if (!dokter) {
        console.log(`Dokter dengan id_dokter ${req.params.id} tidak ditemukan`);
        return res.status(404).json({ message: 'Dokter tidak ditemukan' });
      }
  
      const result = await db.collection('dokters').findOneAndDelete({ id_dokter: req.params.id });
      if (!result || !result.value) {
        console.log(`Dokter dengan id_dokter ${req.params.id} tidak ditemukan`);
        return res.status(404).json({ message: 'Dokter tidak ditemukan' });
      }
      res.json({ message: 'Dokter dihapus' });
    } catch (err) {
      console.error('Error deleting dokter:', err);
      res.status(500).json({ message: err.message });
    }
  });
  
  module.exports = router;
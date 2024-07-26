const express = require('express');
const router = express.Router();
const { getDb } = require('../models/index');
const { authenticate, authorize } = require('../middleware/auth');

//authenticate ini adalah middleware yang biasanya digunakan untuk memverifikasi identitas pengguna yang membuat permintaan. 
//Middleware ini akan memeriksa apakah permintaan datang dari pengguna yang terautentikasi (misalnya, dengan memeriksa token otentikasi dalam header permintaan).
//Jika autentikasi gagal, permintaan akan dihentikan dan pengguna akan menerima respons kesalahan.
//authorize(['admin']) Ini adalah middleware lain yang digunakan untuk memeriksa apakah pengguna yang telah diautentikasi memiliki izin yang sesuai untuk mengakses sumber daya. 
//Dalam hal ini, middleware ini memeriksa apakah pengguna memiliki hak akses yang terkait dengan peran 'dpa'. 
//Biasanya, fungsi authorize akan memeriksa peran atau hak akses pengguna yang sudah diautentikasi dan membandingkannya dengan hak akses yang diperlukan untuk melakukan tindakan ini. 
//Jika pengguna tidak memiliki izin yang diperlukan, permintaan akan dihentikan, dan pengguna akan menerima respons kesalahan.
// Create a new dokter
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const db = getDb();
      
      // Validasi data yang diterima
      const { nama_dokter, spesialisasi, jam_konsultasi, id_bank } = req.body;
      
      if (!nama_dokter || !spesialisasi || !jam_konsultasi || !id_bank) {
        console.log('Missing required fields');
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      // Buat dokter baru
      const newDokter = {
        nama_dokter,
        spesialisasi,
        jam_konsultasi,
        id_bank
      };
  
      const result = await db.collection('dokters').insertOne(newDokter);
      
      // Mengambil data dokter yang baru ditambahkan
      const addedDokter = await db.collection('dokters').findOne({ _id: result.insertedId });
      
      // Menghapus field _id dari respon
      const { _id, ...dokterWithoutId } = addedDokter;
      
      res.status(201).json(dokterWithoutId);
    } catch (err) {
      console.error('Error creating dokter:', err);
      res.status(500).json({ message: err.message });
    }
  });
  
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
// Update a dokter by id_dokter
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const db = getDb();
    const dokterId = parseInt(req.params.id, 10);

    if (isNaN(dokterId)) {
      console.log(`Invalid dokter ID: ${req.params.id}`);
      return res.status(400).json({ message: 'Invalid dokter ID' });
    }

    const updatedDokter = {
      nama_dokter: req.body.nama_dokter,
      spesialisasi: req.body.spesialisasi,
      jam_konsultasi: req.body.jam_konsultasi,
      id_bank: req.body.id_bank
    };

    console.log(`Looking for dokter with id_dokter: ${dokterId}`);
    const dokter = await db.collection('dokters').findOne({ id_dokter: dokterId });
    if (!dokter) {
      console.log(`Dokter with id_dokter ${dokterId} not found`);
      return res.status(404).json({ message: 'Dokter not found' });
    }

    console.log('Dokter found:', dokter);

    const updateResult = await db.collection('dokters').updateOne(
      { id_dokter: dokterId },
      { $set: updatedDokter }
    );

    if (updateResult.matchedCount === 0) {
      console.log(`Dokter with id_dokter ${dokterId} not found after update`);
      return res.status(404).json({ message: 'Dokter not found' });
    }

    const updatedDokterDocument = await db.collection('dokters').findOne({ id_dokter: dokterId });
    console.log('Updated dokter:', updatedDokterDocument);

    const { _id, ...dokterWithoutId } = updatedDokterDocument;
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
      const dokterId = parseInt(req.params.id, 10);
  
      if (isNaN(dokterId)) {
        console.log(`Invalid dokter ID: ${req.params.id}`);
        return res.status(400).json({ message: 'Invalid dokter ID' });
      }
  
      console.log(`dokterId: ${dokterId} (type: ${typeof dokterId})`);
  
      console.log(`Looking for dokter with id_dokter: ${dokterId}`);
      const dokter = await db.collection('dokters').findOne({ id_dokter: dokterId });
      console.log('Query executed:', { id_dokter: dokterId });
      if (!dokter) {
        console.log(`Dokter with id_dokter ${dokterId} not found`);
        return res.status(404).json({ message: 'Dokter not found' });
      }
  
      console.log(`Dokter found before delete: ${JSON.stringify(dokter)}`);
  
      const deleteResult = await db.collection('dokters').deleteOne({ id_dokter: dokterId });
      console.log('Result of deleteOne:', deleteResult);
  
      const dokterAfterDelete = await db.collection('dokters').findOne({ id_dokter: dokterId });
      console.log(`Dokter found after delete attempt: ${JSON.stringify(dokterAfterDelete)}`);
  
      if (deleteResult.deletedCount) {
        console.log(`Dokter with id_dokter ${dokterId} deleted successfully`);
        res.json({ message: 'Dokter deleted' });
      } else {
        console.log(`Failed to delete dokter with id_dokter ${dokterId}`);
        res.status(500).json({ message: 'Failed to delete dokter' });
      }
    } catch (err) {
      console.error('Error deleting dokter:', err);
      res.status(500).json({ message: err.message });
    }
  });
  
  
  module.exports = router;

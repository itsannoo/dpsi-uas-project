const express = require('express');
const router = express.Router();
const { getDb } = require('../models/index');
const { authenticate, authorize } = require('../middleware/auth');

// Get all antreans
router.get('/', authenticate, async (req, res) => {
  try {
    const db = getDb();
    const antreans = await db.collection('antreans').find().toArray();

    const response = antreans.map(antrean => {
      const { _id, ...antreanWithoutId } = antrean;
      return antreanWithoutId;
    });

    res.json(response);
  } catch (err) {
    console.error('Error fetching antreans:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a specific antrean by id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const db = getDb();
    const antrean = await db.collection('antreans').findOne({ id_antrean: parseInt(req.params.id, 10) });
    if (!antrean) {
      console.log(`Antrean with id_antrean ${req.params.id} not found`);
      return res.status(404).json({ message: 'Antrean not found' });
    }

    const { _id, ...antreanWithoutId } = antrean;
    res.json(antreanWithoutId);
  } catch (err) {
    console.error('Error fetching antrean by id:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new antrean
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const db = getDb();

    // Validate input
    const { id_antrean, id_pasien, id_poliklinik, tanggal_pemeriksaan, nomor_antrean, perkiraan_waktu_tunggu } = req.body;
    if (!id_antrean || !id_pasien || !id_poliklinik || !tanggal_pemeriksaan || !nomor_antrean || !perkiraan_waktu_tunggu) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if id_antrean already exists
    const existingAntrean = await db.collection('antreans').findOne({ id_antrean });
    if (existingAntrean) {
      return res.status(400).json({ message: 'id_antrean already exists' });
    }

    // Create new antrean
    const newAntrean = {
      id_antrean,
      id_pasien,
      id_poliklinik,
      tanggal_pemeriksaan,
      nomor_antrean,
      perkiraan_waktu_tunggu
    };

    await db.collection('antreans').insertOne(newAntrean);
    res.status(201).json(newAntrean);
  } catch (err) {
    console.error('Error creating antrean:', err);
    res.status(500).json({ message: 'Failed to create antrean' });
  }
});

// Update an antrean by id_antrean
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const db = getDb();
      const antreanId = parseInt(req.params.id, 10);
      console.log(`antreanId: ${antreanId}`);
  
      const updatedAntrean = {
        id_pasien: req.body.id_pasien,
        id_poliklinik: req.body.id_poliklinik,
        tanggal_pemeriksaan: req.body.tanggal_pemeriksaan,
        nomor_antrean: req.body.nomor_antrean,
        perkiraan_waktu_tunggu: req.body.perkiraan_waktu_tunggu
      };
  
      console.log(`Looking for antrean with id_antrean: ${antreanId}`);
      const antrean = await db.collection('antreans').findOne({ id_antrean: antreanId });
      if (!antrean) {
        console.log(`Antrean with id_antrean ${antreanId} not found`);
        return res.status(404).json({ message: 'Antrean not found' });
      }
  
      console.log('Antrean found:', antrean);
  
      const updateResult = await db.collection('antreans').updateOne(
        { id_antrean: antreanId },
        { $set: updatedAntrean }
      );
  
      if (updateResult.matchedCount === 0) {
        console.log(`Antrean with id_antrean ${antreanId} not found after update`);
        return res.status(404).json({ message: 'Antrean not found' });
      }
  
      const updatedAntreanDocument = await db.collection('antreans').findOne({ id_antrean: antreanId });
      console.log('Updated antrean:', updatedAntreanDocument);
  
      const { _id, ...antreanWithoutId } = updatedAntreanDocument;
      res.json(antreanWithoutId);
    } catch (err) {
      console.error('Error updating antrean:', err);
      res.status(400).json({ message: err.message });
    }
  });

  router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const db = getDb();
      const antreanId = parseInt(req.params.id, 10);
  
      if (isNaN(antreanId)) {
        console.log(`Invalid antrean ID: ${req.params.id}`);
        return res.status(400).json({ message: 'Invalid antrean ID' });
      }
  
      console.log(`Looking for antrean with id_antrean: ${antreanId} (type: ${typeof antreanId})`);
  
      const antrean = await db.collection('antreans').findOne({ id_antrean: antreanId });
      if (!antrean) {
        console.log(`Antrean with id_antrean ${antreanId} not found`);
        return res.status(404).json({ message: 'Antrean not found' });
      }
  
      console.log(`Antrean found before delete: ${JSON.stringify(antrean)}`);
  
      const deleteResult = await db.collection('antreans').deleteOne({ id_antrean: antreanId });
      console.log('Result of deleteOne:', deleteResult);
  
      const antreanAfterDelete = await db.collection('antreans').findOne({ id_antrean: antreanId });
      console.log(`Antrean found after delete attempt: ${JSON.stringify(antreanAfterDelete)}`);
  
      if (deleteResult.deletedCount) {
        console.log(`Antrean with id_antrean ${antreanId} deleted successfully`);
        res.json({ message: 'Antrean deleted' });
      } else {
        console.log(`Failed to delete antrean with id_antrean ${antreanId}`);
        res.status(500).json({ message: 'Failed to delete antrean' });
      }
    } catch (err) {
      console.error('Error deleting antrean:', err);
      res.status(500).json({ message: err.message });
    }
  });
  
module.exports = router;

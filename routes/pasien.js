const express = require('express');
const router = express.Router();
const { getDb } = require('../models/index');
const { authenticate, authorize } = require('../middleware/auth');

// Get all patients
router.get('/', authenticate, async (req, res) => {
  try {
    const db = getDb();
    const patients = await db.collection('pasiens').find().toArray();

    // Remove _id field from each patient in the list
    const response = patients.map(patient => {
      const { _id, ...patientWithoutId } = patient;
      return patientWithoutId;
    });

    res.json(response);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ message: err.message });
  }
});


// Get a specific patient by id
router.get('/:id', authenticate, async (req, res) => {
    try {
      const db = getDb();
      const patient = await db.collection('pasiens').findOne({ id_pasien: parseInt(req.params.id, 10) });
      if (!patient) {
        console.log(`Patient with id_pasien ${req.params.id} not found`);
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      // Remove _id field from response
      const { _id, ...patientWithoutId } = patient;
      res.json(patientWithoutId);
    } catch (err) {
      console.error('Error fetching patient by id:', err);
      res.status(500).json({ message: err.message });
    }
  });

// Create a new patient
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const db = getDb();

    // Validate input
    const { id_pasien, nama_pasien, alamat, nomor_telepon, email, id_bank } = req.body;
    if (!id_pasien || !nama_pasien || !alamat || !nomor_telepon || !email || !id_bank) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if id_pasien already exists
    const existingPatient = await db.collection('pasiens').findOne({ id_pasien });
    if (existingPatient) {
      return res.status(400).json({ message: 'id_pasien already exists' });
    }

    // Create new patient
    const newPatient = {
      id_pasien,
      nama_pasien,
      alamat,
      nomor_telepon,
      email,
      id_bank
    };

    await db.collection('pasiens').insertOne(newPatient);
    res.status(201).json(newPatient);
  } catch (err) {
    console.error('Error creating patient:', err);
    res.status(500).json({ message: 'Failed to create patient' });
  }
});
// Update a patient by id_pasien
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const db = getDb();
      const patientId = parseInt(req.params.id);
      const updatedPatient = {
        nama_pasien: req.body.nama_pasien,
        alamat: req.body.alamat,
        nomor_telepon: req.body.nomor_telepon,
        email: req.body.email,
        id_bank: req.body.id_bank
      };
  
      console.log(`Looking for patient with id_pasien: ${patientId}`);
      const patient = await db.collection('pasiens').findOne({ id_pasien: patientId });
      if (!patient) {
        console.log(`Patient with id_pasien ${patientId} not found`);
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      const result = await db.collection('pasiens').findOneAndUpdate(
        { id_pasien: patientId },
        { $set: updatedPatient },
        { returnDocument: 'after' }
      );
  
      if (!result || !result.value) {
        console.log(`Patient with id_pasien ${patientId} not found`);
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      const { _id, ...patientWithoutId } = result.value;
      res.json(patientWithoutId);
    } catch (err) {
      console.error('Error updating patient:', err);
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete a patient by id_pasien
  router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const db = getDb();
      const patientId = parseInt(req.params.id);
  
      console.log(`Looking for patient with id_pasien: ${patientId}`);
      const patient = await db.collection('pasiens').findOne({ id_pasien: patientId });
      if (!patient) {
        console.log(`Patient with id_pasien ${patientId} not found`);
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      const result = await db.collection('pasiens').findOneAndDelete({ id_pasien: patientId });
      if (!result || !result.value) {
        console.log(`Patient with id_pasien ${patientId} not found`);
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json({ message: 'Patient deleted' });
    } catch (err) {
      console.error('Error deleting patient:', err);
      res.status(500).json({ message: err.message });
    }
  });
  
module.exports = router;

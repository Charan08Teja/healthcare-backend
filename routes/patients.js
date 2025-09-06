const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); 
const Patient = require('../models/Patient');

// POST /api/patients/ - Add new patient (authenticated)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, age, gender, contact, address } = req.body;
    if (!name || !age || !gender) {
      return res.status(400).json({ message: 'Name, age, and gender are required' });
    }

    const patient = await Patient.create({ 
      name, age, gender, contact, address, createdBy: req.user.id 
    });
    res.status(201).json({ patient });
  } catch (err) {
    console.error('Create Patient Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/patients/ - Get all patients created by the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const patients = await Patient.findAll({ where: { createdBy: req.user.id } });
    res.json(patients);
  } catch (err) {
    console.error('Get Patients Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/patients/:id - Get single patient by ID 
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findOne({
      where: { id: req.params.id, createdBy: req.user.id }
    });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    console.error('Get Patient Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/patients/:id - Update patient 
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findOne({
      where: { id: req.params.id, createdBy: req.user.id }
    });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    await patient.update(req.body);
    res.json({ message: 'Patient updated', patient });
  } catch (err) {
    console.error('Update Patient Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/patients/:id - Delete patient 
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findOne({
      where: { id: req.params.id, createdBy: req.user.id }
    });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    await patient.destroy();
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    console.error('Delete Patient Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

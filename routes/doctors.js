const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); 
const Doctor = require('../models/Doctor');

// POST /api/doctors/ - Add new doctor
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, specialization, contact } = req.body;
    if (!name || !email || !specialization) {
      return res.status(400).json({ message: 'Name, email, and specialization are required' });
    }

    const doctor = await Doctor.create({ name, email, specialization, contact });
    res.status(201).json({ doctor });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Create Doctor Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/doctors/ - List all doctors
router.get('/', authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (err) {
    console.error('Get Doctors Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/doctors/:id - Get doctor by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    console.error('Get Doctor Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/doctors/:id - Update doctor
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const { name, email, specialization, contact } = req.body;
    if (!name || !email || !specialization) {
      return res.status(400).json({ message: 'Name, email, and specialization are required' });
    }

    await doctor.update({ name, email, specialization, contact });
    res.json({ message: 'Doctor updated', doctor });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Update Doctor Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/doctors/:id - Delete doctor
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    await doctor.destroy();
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    console.error('Delete Doctor Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

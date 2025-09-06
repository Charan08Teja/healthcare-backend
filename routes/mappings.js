const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Mapping = require('../models/Mapping');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Make sure associations are defined somewhere in your project, for example:
// Patient.hasMany(Mapping, { foreignKey: 'patientId' });
// Mapping.belongsTo(Patient, { foreignKey: 'patientId' });
// Doctor.hasMany(Mapping, { foreignKey: 'doctorId' });
// Mapping.belongsTo(Doctor, { foreignKey: 'doctorId' });

// POST /api/mappings/ - Assign doctor to patient
router.post('/', authMiddleware, async (req, res) => {
  const { patientId, doctorId } = req.body;
  if (!patientId || !doctorId) {
    return res.status(400).json({ message: 'patientId and doctorId are required' });
  }

  try {
    // Check if patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Check if doctor exists
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // Prevent duplicate mapping
    const existing = await Mapping.findOne({ where: { patientId, doctorId } });
    if (existing) return res.status(400).json({ message: 'Mapping already exists' });

    const mapping = await Mapping.create({ patientId, doctorId });
    res.status(201).json({ message: 'Mapping created successfully', mapping });
  } catch (err) {
    console.error('Create Mapping Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/mappings/ - List all mappings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const mappings = await Mapping.findAll({
      include: [
        { model: Patient, attributes: ['id', 'name', 'age', 'gender'] },
        { model: Doctor, attributes: ['id', 'name', 'specialization', 'contact'] }
      ]
    });
    res.json(mappings);
  } catch (err) {
    console.error('Get Mappings Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/mappings/:patientId - Get all doctors for a specific patient
router.get('/:patientId', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const mappings = await Mapping.findAll({
      where: { patientId: req.params.patientId },
      include: [
        { model: Doctor, attributes: ['id', 'name', 'specialization', 'contact'] }
      ]
    });

    res.json(mappings);
  } catch (err) {
    console.error('Get Patient Mappings Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/mappings/:id - Remove mapping
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const mapping = await Mapping.findByPk(req.params.id);
    if (!mapping) return res.status(404).json({ message: 'Mapping not found' });

    await mapping.destroy();
    res.json({ message: 'Mapping removed successfully' });
  } catch (err) {
    console.error('Delete Mapping Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

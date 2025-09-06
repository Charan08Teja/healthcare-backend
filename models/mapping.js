const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

const Mapping = sequelize.define('Mapping', {
  patientId: {
    type: DataTypes.INTEGER,
    references: { model: Patient, key: 'id' },
    allowNull: false,
  },
  doctorId: {
    type: DataTypes.INTEGER,
    references: { model: Doctor, key: 'id' },
    allowNull: false,
  },
});

// Optional: set up associations
Patient.belongsToMany(Doctor, { through: Mapping, foreignKey: 'patientId' });
Doctor.belongsToMany(Patient, { through: Mapping, foreignKey: 'doctorId' });

module.exports = Mapping;

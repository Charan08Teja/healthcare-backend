const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  specialization: { type: DataTypes.STRING, allowNull: false },
  contact: { type: DataTypes.STRING, allowNull: true },
});

module.exports = Doctor;
Doctor.associate = (models) => {
  Doctor.hasMany(models.Mapping, { foreignKey: 'doctorId' });
};


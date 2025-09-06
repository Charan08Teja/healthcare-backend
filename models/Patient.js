const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // import User model for association

const Patient = sequelize.define('Patient', {
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false },
  contact: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: true },
  createdBy: { // foreign key
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

User.hasMany(Patient, { foreignKey: 'createdBy' });
Patient.belongsTo(User, { foreignKey: 'createdBy' });

module.exports = Patient;
Patient.associate = (models) => {
  Patient.hasMany(models.Mapping, { foreignKey: 'patientId' });
};


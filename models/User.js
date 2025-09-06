const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // same instance as server.js

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users', // explicitly set table name
  timestamps: true,   // createdAt and updatedAt
});

module.exports = User;

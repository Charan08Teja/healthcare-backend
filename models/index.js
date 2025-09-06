const Patient = require('./Patient');
const Doctor = require('./Doctor');
const Mapping = require('./Mapping');

const models = { Patient, Doctor, Mapping };

// Call associate methods
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;

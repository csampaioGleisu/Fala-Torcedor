const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Importar os modelos
const Equipe = require('./Equipe');
const Torcedor = require('./Torcedor');

// Configurar associações
Torcedor.belongsTo(Equipe, { foreignKey: 'equipeId' });
Equipe.hasMany(Torcedor, { foreignKey: 'equipeId' });

// Exportar os modelos e a conexão
module.exports = {
  sequelize,
  Sequelize,
  Equipe,
  Torcedor,
};

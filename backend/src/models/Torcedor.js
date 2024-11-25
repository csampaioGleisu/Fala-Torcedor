const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Torcedor = sequelize.define('Torcedor', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataNascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  tempoFiliacao: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'torcedores',
  timestamps: true,
});

module.exports = Torcedor;

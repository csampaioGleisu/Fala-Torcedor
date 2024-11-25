const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Equipe = sequelize.define('Equipe', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'equipes', 
  timestamps: true,
});

module.exports = Equipe;

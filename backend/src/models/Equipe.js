const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Equipe = sequelize.define('Equipe', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  serie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'equipes', 
  timestamps: true,
});

module.exports = Equipe;

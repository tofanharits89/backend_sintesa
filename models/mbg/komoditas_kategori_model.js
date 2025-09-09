import { DataTypes } from 'sequelize';
import Database8 from '../../config/Database8.js';

const komoditas_kategori_model = Database8.define('komoditas_kategori', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  provinsi: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  komoditas: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  kategori: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  regional: {
    type: DataTypes.STRING(30),
    allowNull: true
  }
}, {
  tableName: 'komoditas_kategori',
  timestamps: false,
  freezeTableName: true
});

export default komoditas_kategori_model;

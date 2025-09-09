import { DataTypes } from "sequelize";
import db from "../../config/Database8.js";

const PenerimaKelompok = db.define('by_kelompok_detail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  provinsi: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  kdkanwil: {
    type: DataTypes.CHAR(2),
    allowNull: true
  },
  nmkanwil: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  wilprov: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  kabKota: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  kecamatan: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  kelurahanDesa: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  namaSPPG: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  jenisSPPG: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  namaKaSPPG: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  noTelepon: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  jenisKelompok: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  namaKelompok: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  id_kelompok: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  regional: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: "by_kelompok_detail",
  timestamps: false
});

export default PenerimaKelompok;

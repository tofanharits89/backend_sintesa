import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const RekamBPS = db.define("rekam_bps", {
  tahun: {
    type: DataTypes.ENUM("2023", "2024"),
    allowNull: false,
  },
  kanwil: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  triwulan: {
    type: DataTypes.ENUM("Q1", "Q2", "Q3", "Q4"),
    allowNull: false,
  },
  indikator: {
    type: DataTypes.ENUM("Ekonomi", "Fiskal"),
    allowNull: false,
  },
  komoditas: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  satuan: {
    type: DataTypes.ENUM("Kg", "Ton", "Rp"),
    allowNull: false,
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  timestamps: true,
});

export default RekamBPS;

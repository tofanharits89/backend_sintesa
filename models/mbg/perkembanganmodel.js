import { DataTypes } from "sequelize";
import db from "../../config/Database8.js";

const MBGNarasi = db.define(
  "mbg_narasi",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    kode_kanwil: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    uraian_kanwil: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    kapasitas: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sistem: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ketersediaan: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    koordinasi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dukungan: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isu_lain: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    bulan: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    tahun: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
  },
  {
    tableName: "mbg_narasi",
    timestamps: false,
  }
);

export default MBGNarasi;

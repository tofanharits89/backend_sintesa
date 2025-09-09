import { Sequelize } from "sequelize";
import db from "../../config/Database8.js";
const { DataTypes } = Sequelize;

const DataTriwulanan = db.define(
  "indikator_triwulanan",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kode_kanwil: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    kategori: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    triwulan: {
      type: DataTypes.ENUM("I", "II", "III", "IV"),
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tahun: {
      type: DataTypes.INTEGER, // bisa juga pakai DataTypes.STRING(4) kalau format tahun tidak selalu numerik
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "indikator_triwulanan",
    timestamps: false,
  }
);

export default DataTriwulanan;

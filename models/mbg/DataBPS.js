import { Sequelize } from "sequelize";
import db from "../../config/Database8.js";
const { DataTypes } = Sequelize;

const DataBPS = db.define(
  "indikator_bps",
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
    indikator: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    customIndikator: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    customSatuan: {
      type: DataTypes.STRING(100),
      allowNull: true,
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
    tableName: "indikator_bps",
    timestamps: false,
  }
);

export default DataBPS;

import { DataTypes } from "sequelize";
import db from "../../config/Database8.js";

const summarymodel = db.define(
  "data_summary_prov",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    wilkode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    wilnama: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    kdkanwil: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    nmkanwil: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    jumlahsppg: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jumlahpenerima: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jumlahkelompok: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jumlahpetugas: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jumlahsupplier: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "data_summary_prov",
    timestamps: false,
  }
);

export default summarymodel;

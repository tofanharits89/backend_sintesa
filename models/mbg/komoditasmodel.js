import { DataTypes } from "sequelize";
import db from "../../config/Database8.js";

const komoditasmodel = db.define(
  "rekap_harga_komoditas",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Provinsi: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Kategori: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Jan: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Feb: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Mar: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Apr: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Mei: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Jun: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Jul: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Agt: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Sep: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Okt: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Nov: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Des: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Cluster: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    kode_kanwil: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    nmkanwil: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "rekap_harga_komoditas",
    timestamps: false,
  }
);

export default komoditasmodel;

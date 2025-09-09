import { DataTypes } from "sequelize";
import db from "../../config/Database8.js";

const ntpmodel = db.define(
  "ntp_ntn",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kode_kanwil: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    nama_kanwil: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    provinsi: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    kategori: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jan: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    feb: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    mar: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    apr: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    mei: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    jun: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    jul: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    agt: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sep: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    okt: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    nov: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    des: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    tahunan: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "ntp_ntn",
    timestamps: false,
  }
);

export default ntpmodel;

import { Sequelize } from "sequelize";
import db from "../../config/Database8.js";

const { DataTypes } = Sequelize;

const Inflasi_Tembakau_Model = db.define(
  "inflasi_tembakau",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
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
      type: DataTypes.STRING(100),
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
    aug: {
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
    freezeTableName: true,
    timestamps: false, // Tidak menggunakan timestamps karena tidak ada createdAt/updatedAt di struktur tabel
  }
);

export default Inflasi_Tembakau_Model;

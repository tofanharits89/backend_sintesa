import { Sequelize } from "sequelize";
import db from "../../config/Database8.js";

const { DataTypes } = Sequelize;

const Inflasi_MTM_Model = db.define(
  "inflasi_mtm",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    provinsi: {
      type: DataTypes.STRING(100),
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
    },    tahunan: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    kode_kanwil: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    nama_kanwil: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // Tidak menggunakan timestamps karena tidak ada createdAt/updatedAt di struktur tabel
  }
);

export default Inflasi_MTM_Model;

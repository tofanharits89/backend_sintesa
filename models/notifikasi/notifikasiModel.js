import { Sequelize } from "sequelize";
import db from "../../config/Database.js";

const { DataTypes } = Sequelize;

const Notifikasi_Model = db.define(
  "notifikasi",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tipe_notif: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tujuan: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dari: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pinned: {
      type: DataTypes.CHAR,
      allowNull: true,
    },
    tipe: {
      type: DataTypes.CHAR,
      allowNull: true,
    },
    status: {
      type: DataTypes.CHAR,
      allowNull: true,
    },
    // TAMBAHKAN INI
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // Atau true, sesuai kebutuhan
  }
);

export default Notifikasi_Model;

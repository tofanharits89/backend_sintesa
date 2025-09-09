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
    },    // TAMBAHKAN INI
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    // createdAt dan updatedAt akan dikelola otomatis oleh timestamps: true
  },
  {
    freezeTableName: true,
    timestamps: true, // Ubah ini dari false ke true agar createdAt dan updatedAt otomatis terisi
  }
);

export default Notifikasi_Model;

import { Sequelize } from "sequelize";
import db from "../../config/Database3.js";

const { DataTypes } = Sequelize;

const DispensasiKPPN_Model = db.define(
  "dispensasi_kppn",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    thang: {
      type: DataTypes.CHAR(4),
      allowNull: true,
    },
    kddept: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    kdunit: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    kdsatker: {
      type: DataTypes.CHAR(6),
      allowNull: true,
    },
    jenis: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    kdlokasi: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    kdkppn: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    tgpermohonan: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nopermohonan: {
      type: DataTypes.CHAR(250),
      allowNull: true,
    },

    jmlkontrak: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },

    kd_dispensasi: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    tgpersetujuan: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nopersetujuan: {
      type: DataTypes.CHAR(150),
      allowNull: true,
    },

    uraian: {
      type: DataTypes.BLOB,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: true, // Menggunakan timestamps untuk otomatis mengelola `created_at` dan `updated_at`
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default DispensasiKPPN_Model;

import { Sequelize } from "sequelize";
import db from "../config/Database3.js";

const { DataTypes } = Sequelize;

const MonevPnbp = db.define(
  "monev_pnbp",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tahun: {
      type: DataTypes.CHAR(4),
    },
    triwulan: {
      type: DataTypes.CHAR(3),
    },
    kdkanwil: {
      type: DataTypes.CHAR(2),
    },
    nmkanwil: {
      type: DataTypes.STRING,
    },
    kddept: {
      type: DataTypes.CHAR(3),
    },
    kdsatker: {
      type: DataTypes.STRING, // Sesuaikan dengan tipe data kolom 'kdsatker'
      primaryKey: true, // Tandai sebagai primary key
    },
    nmsatker: {
      type: DataTypes.STRING,
    },
    target: {
      type: DataTypes.DECIMAL(21, 0),
      defaultValue: 0,
    },
    setoran: {
      type: DataTypes.DECIMAL(21, 0),
      defaultValue: 0,
    },
    persen_pnbp: {
      type: DataTypes.DECIMAL(20, 4),
      defaultValue: 0.0,
    },
    mp_riil: {
      type: DataTypes.DECIMAL(21, 0),
      defaultValue: 0,
    },
    pagu_belanja: {
      type: DataTypes.DECIMAL(21, 0),
      defaultValue: 0,
    },
    kdmppnbp: {
      type: DataTypes.CHAR(20),
    },
    real_belanja: {
      type: DataTypes.DECIMAL(21, 0),
      defaultValue: 0,
    },
    persen_belanja: {
      type: DataTypes.DECIMAL(20, 4),
      defaultValue: 0.0,
    },
    selisih_belanja_mp_riil: {
      type: DataTypes.DECIMAL(21, 0),
      defaultValue: 0,
    },
    nd_kanwil: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    tgl_surat: {
      type: DataTypes.DATE,
    },
    no_surat: {
      type: DataTypes.STRING(500),
    },
    file_surat: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    ringkasan: {
      type: DataTypes.STRING,
      defaultValue: "", // Default menjadi string kosong
    },
    laporan: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    tgl_kirim: {
      type: DataTypes.DATE, // Menggunakan DATE untuk datetime
    },
    tgl_upload_koord: {
      type: DataTypes.DATE, // Menggunakan DATE untuk datetime
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
    timestamps: true,
    underscored: true,
  }
);

export default MonevPnbp;

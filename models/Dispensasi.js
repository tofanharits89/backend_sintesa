import { Sequelize } from "sequelize";
import db from "../config/Database3.js";

const { DataTypes } = Sequelize;

const Dispensasi = db.define(
  "dispensasi_spm",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    thang: {
      type: DataTypes.CHAR(4),
    },
    kddept: {
      type: DataTypes.CHAR(3),
    },
    kdunit: {
      type: DataTypes.CHAR(2),
    },
    kdsatker: {
      type: DataTypes.STRING, // Sesuaikan dengan tipe data kolom 'kdsatker'
      primaryKey: true, // Tandai sebagai primary key
    },
    kdlokasi: {
      type: DataTypes.CHAR(2),
    },
    kdkppn: {
      type: DataTypes.CHAR(3),
    },
    tgpermohonan: {
      type: DataTypes.DATE,
    },
    nopermohonan: {
      type: DataTypes.CHAR(250),
    },
    uraian: {
      type: DataTypes.STRING(500),
    },
    kd_dispensasi: {
      type: DataTypes.CHAR(2),
    },
    tgpersetujuan: {
      type: DataTypes.DATE,
    },
    nopersetujuan: {
      type: DataTypes.CHAR(150),
    },
    kdkanwil: {
      type: DataTypes.CHAR(10),
    },
    rpata: {
      type: DataTypes.CHAR(4),
    },

    jmlspm: {
      type: DataTypes.CHAR(9),
    },
    file: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  }
);

export default Dispensasi;

import { Sequelize } from "sequelize";
import db from "../../config/DatabaseOmspan.js";

const { DataTypes } = Sequelize;

const Pemotongan_Model = db.define(
  "data_pemotongan",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    THANG: {
      type: DataTypes.STRING(4),
    },
    PERIODE: {
      type: DataTypes.STRING(2),
    },
    GELOMBANG: {
      type: DataTypes.STRING(1),
    },
    KODE_PEMDA: {
      type: DataTypes.STRING(4),
    },
    JENIS_TKD: {
      type: DataTypes.STRING(4),
    },
    KODE_KPPN: {
      type: DataTypes.STRING(3),
    },
    KODE_KANWIL: {
      type: DataTypes.STRING(2),
    },
    NILAI_PEMOTONGAN: {
      type: DataTypes.INTEGER,
    },
    NOMOR_ND: {
      type: DataTypes.STRING(255),
    },
    COA: {
      type: DataTypes.STRING(255),
    },
    AKUN: {
      type: DataTypes.STRING(6),
    },
    TANGGAL_ND: {
      type: DataTypes.DATEONLY,
    },
    NAMA_PERIODE: {
      type: DataTypes.STRING(20),
    },
    NAMA_DETAIL: {
      type: DataTypes.STRING(255),
    },
    NM_LOKASI: {
      type: DataTypes.STRING(50),
    },
  },
  {
    freezeTableName: true,
  }
);

export default Pemotongan_Model;

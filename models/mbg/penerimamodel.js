import { DataTypes } from "sequelize";
import db from "../../config/Database8.js";

const penerimaModel = db.define(
  "by_penerima_detail",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    provinsi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    kdkanwil: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    nmkanwil: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    kabKota: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    kecamatan: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    kelurahanDesa: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    namaSPPG: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    jenisSPPG: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    namaKaSPPG: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    noTelepon: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    jenisKelompok: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    namaKelompok: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pria: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    wanita: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_penerima: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    WilProv: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "by_penerima_detail",
    timestamps: false,
  }
);

export default penerimaModel;

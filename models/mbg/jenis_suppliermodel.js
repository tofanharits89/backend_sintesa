import { DataTypes } from "sequelize";
import db from "../../config/Database8.js";

const jenisSupplierModel = db.define(
  "by_supplier_prov",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    provinsi: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    kdkanwil: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    nmkanwil: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    kabupaten: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    kecamatan: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    kelurahan: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    nama_supplier: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    jenis: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    komoditas: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pimpinan: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    telp_supplier: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    nama_sppg: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    jenis_sppg: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    nama_ka_sppg: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    telp_ka_sppg: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    wilayah: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    regional: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: "by_supplier_prov",
    timestamps: false,
  }
);

export default jenisSupplierModel;

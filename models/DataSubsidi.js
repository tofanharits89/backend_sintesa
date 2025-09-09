import { Sequelize } from "sequelize";
import db from "../config/Database9.js"; // sesuaikan koneksi (db9/Database9.js)

const { DataTypes } = Sequelize;

const DataSubsidi = db.define(
  "subsidi_bulanan_2025",
  {
    tahun: { type: DataTypes.CHAR(4), primaryKey: true },
    kddept: { type: DataTypes.STRING(50), primaryKey: true },
    kdunit: { type: DataTypes.STRING(50), primaryKey: true },
    kdsatker: { type: DataTypes.STRING(50), primaryKey: true },
    kdprogram: { type: DataTypes.STRING(50), primaryKey: true },
    kdkegiatan: { type: DataTypes.STRING(50), primaryKey: true },
    kdoutput: { type: DataTypes.STRING(50), primaryKey: true },
    kdakun: { type: DataTypes.STRING(50), primaryKey: true },
    kdprov: { type: DataTypes.STRING(50), primaryKey: true },
    kdkabkota: { type: DataTypes.STRING(50), primaryKey: true },
    kdkec: { type: DataTypes.STRING(50), primaryKey: true },
    jns_bansos: { type: DataTypes.STRING(50), primaryKey: true },

    real1: { type: DataTypes.DECIMAL(20, 2) },
    real2: { type: DataTypes.DECIMAL(20, 2) },
    real3: { type: DataTypes.DECIMAL(20, 2) },
    real4: { type: DataTypes.DECIMAL(20, 2) },
    real5: { type: DataTypes.DECIMAL(20, 2) },
    real6: { type: DataTypes.DECIMAL(20, 2) },
    real7: { type: DataTypes.DECIMAL(20, 2) },
    real8: { type: DataTypes.DECIMAL(20, 2) },
    real9: { type: DataTypes.DECIMAL(20, 2) },
    real10: { type: DataTypes.DECIMAL(20, 2) },
    real11: { type: DataTypes.DECIMAL(20, 2) },
    real12: { type: DataTypes.DECIMAL(20, 2) },

    jml_penerima1: { type: DataTypes.INTEGER },
    jml_penerima2: { type: DataTypes.INTEGER },
    jml_penerima3: { type: DataTypes.INTEGER },
    jml_penerima4: { type: DataTypes.INTEGER },
    jml_penerima5: { type: DataTypes.INTEGER },
    jml_penerima6: { type: DataTypes.INTEGER },
    jml_penerima7: { type: DataTypes.INTEGER },
    jml_penerima8: { type: DataTypes.INTEGER },
    jml_penerima9: { type: DataTypes.INTEGER },
    jml_penerima10: { type: DataTypes.INTEGER },
    jml_penerima11: { type: DataTypes.INTEGER },
    jml_penerima12: { type: DataTypes.INTEGER },

    jml_va1: { type: DataTypes.INTEGER },
    jml_va2: { type: DataTypes.INTEGER },
    jml_va3: { type: DataTypes.INTEGER },
    jml_va4: { type: DataTypes.INTEGER },
    jml_va5: { type: DataTypes.INTEGER },
    jml_va6: { type: DataTypes.INTEGER },
    jml_va7: { type: DataTypes.INTEGER },
    jml_va8: { type: DataTypes.INTEGER },
    jml_va9: { type: DataTypes.INTEGER },
    jml_va10: { type: DataTypes.INTEGER },
    jml_va11: { type: DataTypes.INTEGER },
    jml_va12: { type: DataTypes.INTEGER },
  },
  {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  }
);

export default DataSubsidi;

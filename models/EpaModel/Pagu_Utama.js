import { DataTypes } from "sequelize";
import db from "../../config/Database10.js";

const PaguUtama = db.define(
  "pagu_real_utama",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    thang: {
      type: DataTypes.STRING,
    },
    kdsatker: {
      type: DataTypes.STRING,
    },
    nmsatker: {
      type: DataTypes.STRING,
    },
    kdprogram: {
      type: DataTypes.STRING,
    },
    nmprogram: {
      type: DataTypes.STRING,
    },
    kdunit: {
      type: DataTypes.STRING,
    },
    nmunit: {
      type: DataTypes.STRING,
    },
    pagu: {
      type: DataTypes.DOUBLE,
    },
    real1: {
      type: DataTypes.DOUBLE,
    },
    real2: {
      type: DataTypes.DOUBLE,
    },
    real3: {
      type: DataTypes.DOUBLE,
    },
    real4: {
      type: DataTypes.DOUBLE,
    },
    real5: {
      type: DataTypes.DOUBLE,
    },
    real6: {
      type: DataTypes.DOUBLE,
    },
    real7: {
      type: DataTypes.DOUBLE,
    },
    real8: {
      type: DataTypes.DOUBLE,
    },
    real9: {
      type: DataTypes.DOUBLE,
    },
    real10: {
      type: DataTypes.DOUBLE,
    },
    real11: {
      type: DataTypes.DOUBLE,
    },
    real12: {
      type: DataTypes.DOUBLE,
    },
    blokir: {
      type: DataTypes.DOUBLE,
    },
    keterangan: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "pagu_real_utama",
    timestamps: false,
  }
);

export default PaguUtama;

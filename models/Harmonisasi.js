import { Sequelize } from "sequelize";
import db from "../config/Database7.js";

const { DataTypes } = Sequelize;

const Harmonisasi = db.define(
  "pagu_output_2024_new_harmonis_smt1",
  {
    thang: {
      type: DataTypes.CHAR(4),
      defaultValue: null,
    },
    semester: {
      type: DataTypes.CHAR(3),
      defaultValue: null,
    },
    kdkanwil: {
      type: DataTypes.CHAR(2),
      defaultValue: null,
    },
    kddept: {
      type: DataTypes.CHAR(3),
      defaultValue: null,
    },
    kdsatker: {
      type: DataTypes.CHAR(6),
      defaultValue: null,
    },
    nmsatker: {
      type: DataTypes.STRING(600),
      defaultValue: null,
    },
    bidang_dak: {
      type: DataTypes.STRING(300),
      defaultValue: null,
    },
    subdang_dak: {
      type: DataTypes.STRING(750),
      defaultValue: null,
    },
    kdkabkota: {
      type: DataTypes.CHAR(2),
      defaultValue: null,
    },
    kdlokasi: {
      type: DataTypes.CHAR(2),
      defaultValue: null,
    },
    kdprogram: {
      type: DataTypes.CHAR(2),
      defaultValue: null,
    },
    kdgiat: {
      type: DataTypes.CHAR(4),
      defaultValue: null,
    },
    kdoutput: {
      type: DataTypes.CHAR(3),
      defaultValue: null,
    },
    kdsoutput: {
      type: DataTypes.CHAR(3),
      defaultValue: null,
    },
    ursoutput: {
      type: DataTypes.STRING(1500),
      defaultValue: null,
    },
    vol: {
      type: DataTypes.DECIMAL(39, 4),
      defaultValue: null,
    },
    sat: {
      type: DataTypes.CHAR(105),
      defaultValue: null,
    },
    pagu: {
      type: DataTypes.DECIMAL(43, 0),
      defaultValue: null,
    },
    real1: {
      type: DataTypes.DECIMAL(21, 0),
      defaultValue: 0,
    },
    real2: {
      type: DataTypes.DECIMAL(21, 0),
      defaultValue: 0,
    },
    real3: {
      type: DataTypes.DECIMAL(21, 0),
      defaultValue: 0,
    },
    real4: {
      type: DataTypes.DECIMAL(21, 0),
      defaultValue: 0,
    },
    real5: {
      type: DataTypes.DECIMAL(21, 0),
      defaultValue: 0,
    },
    real6: {
      type: DataTypes.DECIMAL(21, 0),
      defaultValue: 0,
    },
    realfisik1: {
      type: DataTypes.DECIMAL(22, 2),
      defaultValue: 0.0,
    },
    realfisik2: {
      type: DataTypes.DECIMAL(22, 2),
      defaultValue: 0.0,
    },
    realfisik3: {
      type: DataTypes.DECIMAL(22, 2),
      defaultValue: 0.0,
    },
    realfisik4: {
      type: DataTypes.DECIMAL(22, 2),
      defaultValue: 0.0,
    },
    realfisik5: {
      type: DataTypes.DECIMAL(22, 2),
      defaultValue: 0.0,
    },
    realfisik6: {
      type: DataTypes.DECIMAL(22, 2),
      defaultValue: 0.0,
    },
    c1: {
      type: DataTypes.STRING(60),
      defaultValue: 0.0,
    },
    c2: {
      type: DataTypes.STRING(60),
      defaultValue: 0.0,
    },
    c3: {
      type: DataTypes.STRING(60),
      defaultValue: 0.0,
    },
    c4: {
      type: DataTypes.STRING(60),
      defaultValue: 0.0,
    },
    c5: {
      type: DataTypes.STRING(60),
      defaultValue: 0.0,
    },
    ket1: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket2: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket3: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket4: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket5: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Harmonisasi;

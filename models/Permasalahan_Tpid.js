import { Sequelize } from "sequelize";
import db from "../config/Database3.js";

const { DataTypes } = Sequelize;

const Tpid = db.define(
  "permasalahan_inflasi",
  {
    thang: {
      type: DataTypes.CHAR(4),
      defaultValue: null,
    },
    triwulan: {
      type: DataTypes.CHAR(3),
      defaultValue: null,
    },
    kdkanwil: {
      type: DataTypes.CHAR(6),
      defaultValue: null,
    },
    proker: {
      type: DataTypes.STRING(300),
      defaultValue: null,
    },
    ket1_kl: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket2_kl: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket3_kl: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket4_kl: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket5_kl: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket6_kl: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket7_tkd: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket8_tkd: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket9_tkd: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket10_tkd: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket11_tkd: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    ket12_tkd: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    rekom1_kl: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    rekom2_kl: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    rekom3_kl: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    rekom4_kl: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    rekom5_kl: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    rekom6_kl: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    rekom7_tkd: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    rekom8_tkd: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    rekom9_tkd: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    rekom10_tkd: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    rekom11_tkd: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
    rekom12_tkd: {
      type: DataTypes.STRING,
      defaultValue: 0.0,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Tpid;

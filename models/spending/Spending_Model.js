import { Sequelize } from "sequelize";
import db from "../../config/Database6.js";

const { DataTypes } = Sequelize;

const Spending_Model = db.define(
  "dt_review_2024",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    thang: {
      type: DataTypes.CHAR(4),
      defaultValue: null,
    },
    kdsatker: {
      type: DataTypes.CHAR(6),
      defaultValue: null,
    },
    kddept: {
      type: DataTypes.CHAR(3),
      defaultValue: null,
    },
    kdunit: {
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
    kddekon: {
      type: DataTypes.CHAR(1),
      defaultValue: null,
    },
    kdsoutput: {
      type: DataTypes.CHAR(3),
      defaultValue: null,
    },
    kdkmpnen: {
      type: DataTypes.CHAR(3),
      defaultValue: null,
    },
    kdskmpnen: {
      type: DataTypes.CHAR(2),
      defaultValue: null,
    },
    kdakun: {
      type: DataTypes.CHAR(6),
      defaultValue: null,
    },
    noitem: {
      type: DataTypes.STRING(5),
      defaultValue: null,
    },
    nmitem: {
      type: DataTypes.CHAR(120),
      defaultValue: null,
    },
    volkeg: {
      type: DataTypes.DECIMAL(20, 0),
      defaultValue: null,
    },
    satkeg: {
      type: DataTypes.CHAR(5),
      defaultValue: null,
    },
    hargasat: {
      type: DataTypes.DECIMAL(20, 0),
      defaultValue: null,
    },
    jumlah: {
      type: DataTypes.DECIMAL(20, 0),
      defaultValue: null,
    },
    inefisiensi: {
      type: DataTypes.DECIMAL(20, 0),
      defaultValue: null,
    },
    kdreview: {
      type: DataTypes.CHAR(2),
      defaultValue: null,
    },
    keterangan: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    posisi: {
      type: DataTypes.CHAR(159),
      defaultValue: null,
    },
    flag: {
      type: DataTypes.CHAR(10),
      defaultValue: null,
    },
    username: {
      type: DataTypes.CHAR(10),
      defaultValue: null,
    },
    kdkanwil: {
      type: DataTypes.CHAR(2),
      defaultValue: null,
    },
    sebab: {
      type: DataTypes.CHAR(2),
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Spending_Model;

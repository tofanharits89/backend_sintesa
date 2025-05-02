import { Sequelize } from "sequelize";
import db from "../config/Database4.js";

const { DataTypes } = Sequelize;

const Satker = db.define(
  "t_satker_2025",
  {
    kdsatker: {
      type: DataTypes.STRING,
    },
    nmsatker: {
      type: DataTypes.STRING,
    },
    kddept: {
      type: DataTypes.STRING,
    },
    kdunit: {
      type: DataTypes.STRING,
    },
    kdlokasi: {
      type: DataTypes.STRING,
    },
    kdkabkota: {
      type: DataTypes.STRING,
    },
    kddekon: {
      type: DataTypes.STRING,
    },
    kdkppn: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Satker;

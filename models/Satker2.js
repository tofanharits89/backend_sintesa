import { Sequelize } from "sequelize";
import db from "../config/Database4.js";

const { DataTypes } = Sequelize;

const Satker2 = db.define(
  "t_satker_kppn_2025",
  {
    kdsatker: {
      type: DataTypes.STRING,
    },
    nmsatker: {
      type: DataTypes.STRING,
    },

    kdkanwil: {
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

export default Satker2;

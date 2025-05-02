import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Setting = db.define(
  "setting",
  {
    mode: {
      type: DataTypes.STRING,
    },
    tampil: {
      type: DataTypes.STRING,
    },
    tampilverify: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    capcay: {
      type: DataTypes.STRING,
    },
    session: {
      type: DataTypes.STRING,
    },
    verify: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Setting;

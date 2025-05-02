import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Log_menu = db.define(
  "log_menu",
  {
    ip: {
      type: DataTypes.STRING,
    },
    nm_menu: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Log_menu;

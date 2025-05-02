import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Login_status = db.define(
  "login_status",
  {
    username: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    ip: {
      type: DataTypes.STRING,
    },

    date: {
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Login_status;

import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "../models/UserModel.js";

const { DataTypes } = Sequelize;

const User_log = db.define(
  "log_user",
  {
    username: {
      type: DataTypes.STRING,
    },
    date_login: {
      type: DataTypes.DATE,
    },
    date_logout: {
      type: DataTypes.DATE,
    },
    ip: {
      type: DataTypes.STRING,
    },
    login_by: {
      type: DataTypes.STRING,
    },
    browser: {
      type: DataTypes.TEXT,
    },
    name: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);
User_log.associate = () => {
  User_log.belongsTo(Users, {
    foreignKey: "username",
    targetKey: "username",
  });
};

export default User_log;

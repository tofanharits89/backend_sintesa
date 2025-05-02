import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User_log from "../models/User_log.js";
import User_role from "../models/User_role.js";

const { DataTypes } = Sequelize;

const Users = db.define(
  "users",
  {
    name: {
      type: DataTypes.STRING,
    },

    active: {
      type: DataTypes.STRING,
    },
    dept_limit: {
      type: DataTypes.TEXT,
    },
    username: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    kdkanwil: {
      type: DataTypes.STRING,
    },
    kdlokasi: {
      type: DataTypes.STRING,
    },
    kdkppn: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    telp: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
    filename: {
      type: DataTypes.STRING,
    },
    filesize: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
    ext: {
      type: DataTypes.STRING,
    },
    online: {
      type: DataTypes.STRING,
    },
    ip: {
      type: DataTypes.STRING,
    },
    verified: {
      type: DataTypes.STRING,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    tgl_login: {
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(User_log, {
  foreignKey: "username",
  sourceKey: "username",
});

export default Users;

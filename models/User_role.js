import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User_role = db.define(
  "role",
  {
    kdrole: {
      type: DataTypes.STRING,
    },
    nmrole: {
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
  }
);

export default User_role;

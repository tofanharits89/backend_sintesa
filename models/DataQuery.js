import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const DataQuery = db.define(
  "simpan_query",
  {
    jenis: {
      type: DataTypes.STRING,
    },
    nama: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    query: {
      type: DataTypes.STRING,
    },
    thang: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default DataQuery;

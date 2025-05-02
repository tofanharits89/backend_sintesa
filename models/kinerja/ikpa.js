import { Sequelize } from "sequelize";
import db from "../../config/Database3.js";

const { DataTypes } = Sequelize;

const Ikpa_Model = db.define(
  "tren_ikpa",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    thang: {
      type: DataTypes.CHAR(4),
      allowNull: true,
    },
    kddept: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    periode: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },

    username: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nilaiikpa: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Ikpa_Model;

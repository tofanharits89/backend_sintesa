import { Sequelize } from "sequelize";
import db135 from "../../config/Database135MBG.js";
const { DataTypes } = Sequelize;

const Komoditas = db135.define(
  "data_komoditas",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kdkanwil: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kabkota: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kdlokasi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    komoditas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    volume: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sppg: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "data_komoditas",
    timestamps: false,
  }
);

export default Komoditas;

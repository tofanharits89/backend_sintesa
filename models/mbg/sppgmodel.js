import { DataTypes } from "sequelize";
import db from "../../config/Database8.js";

const sppgModel = db.define(
  "sppg_historis",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    kode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    kanwil: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    kdkanwil: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    nmkanwil: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    jan: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    feb: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    mar: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    apr: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    mei: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    jun: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    jul: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    agt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    sep: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    okt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    nov: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    des: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    tableName: "sppg_historis",
    timestamps: false,
  }
);

export default sppgModel;

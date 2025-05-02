import { Sequelize } from "sequelize";
import db from "../../config/Database3.js";

const { DataTypes } = Sequelize;

const TemuanBpk_Model = db.define(
  "temuan_bpk_cluster",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    thang: {
      type: DataTypes.CHAR(4),
      allowNull: true,
    },
    kdcluster: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    periode: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    id_temuan: {
      type: DataTypes.STRING(100),
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isu: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nilai: {
      type: DataTypes.STRING(100),
    },
  },
  {
    freezeTableName: true,
  }
);

export default TemuanBpk_Model;

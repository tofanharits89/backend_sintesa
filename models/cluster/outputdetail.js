import { Sequelize } from "sequelize";
import db from "../../config/Database3.js";

const { DataTypes } = Sequelize;

const OutputDetail_Model = db.define(
  "output_detail_cluster",
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
    id_output: {
      type: DataTypes.CHAR(100),
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tahun: {
      type: DataTypes.CHAR(4),
      allowNull: true,
    },
    pagu: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    realisasi: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    persen: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default OutputDetail_Model;

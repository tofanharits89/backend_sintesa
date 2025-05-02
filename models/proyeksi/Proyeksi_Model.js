import { Sequelize } from "sequelize";
import db from "../../config/DatabaseTkd.js";

const { DataTypes } = Sequelize;

const Proyeksi_Model = db.define(
  "proyeksi",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    keperluan: {
      type: DataTypes.CHAR(4),
      allowNull: true,
    },
    thang: {
      type: DataTypes.CHAR(4),
      allowNull: true,
    },
    periode: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    kdkppn: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    kdsatker: {
      type: DataTypes.CHAR(6),
      allowNull: true,
    },
    jenis_tkd: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    jan: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },
    feb: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },
    mar: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },
    apr: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },
    mei: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },
    jun: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },
    jul: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },
    ags: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },
    sep: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },
    okt: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },
    nov: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },
    des: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },
    keterangan: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Proyeksi_Model;

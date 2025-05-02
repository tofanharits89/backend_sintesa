import { Sequelize } from "sequelize";
import db from "../config/Database3.js";

const { DataTypes } = Sequelize;

const Tup = db.define(
  "dispensasi_tup",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    thang: {
      type: DataTypes.CHAR(4),
    },
    kddept: {
      type: DataTypes.CHAR(3),
    },
    kdunit: {
      type: DataTypes.CHAR(2),
    },
    kdsatker: {
      type: DataTypes.CHAR(6),
    },
    kdlokasi: {
      type: DataTypes.CHAR(2),
    },
    kdkppn: {
      type: DataTypes.CHAR(3),
    },
    tgpermohonan: {
      type: DataTypes.DATE,
    },
    nopermohonan: {
      type: DataTypes.CHAR(250),
    },
    uraian: {
      type: DataTypes.STRING(500),
    },
    tgpersetujuan: {
      type: DataTypes.DATE,
    },
    nopersetujuan: {
      type: DataTypes.CHAR(150),
    },

    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    kdkanwil: {
      type: DataTypes.CHAR(10),
    },

    jmltup: {
      type: DataTypes.CHAR(9),
    },
    kd_dispensasi: {
      type: DataTypes.CHAR(2),
    },
    file: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    username: {
      type: DataTypes.CHAR(384),
    },
    kdkanwil_upload: {
      type: DataTypes.CHAR(400),
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  }
);

export default Tup;

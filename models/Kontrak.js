import { Sequelize } from "sequelize";
import db from "../config/Database3.js";

const { DataTypes } = Sequelize;

const Kontrak = db.define(
  "dispensasi_kontrak",
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

    jmlkontrak: {
      type: DataTypes.CHAR(9),
    },
    kd_dispensasi: {
      type: DataTypes.CHAR(2),
    },
    file: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  }
);

export default Kontrak;

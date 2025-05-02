import { Sequelize } from "sequelize";
import db from "../../config/DatabaseTkd.js";

const { DataTypes } = Sequelize;

const Ref_pencabutan = db.define(
  "pencabutan",
  {
    thang: {
      type: DataTypes.CHAR(12),
      allowNull: true,
    },
    jenis: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    kriteria: {
      type: DataTypes.CHAR(6),
      allowNull: true,
    },
    kmk_tunda: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    kmk_cabut: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    kdpemda: {
      type: DataTypes.CHAR(12),
      allowNull: true,
    },
    kdkppn: {
      type: DataTypes.CHAR(9),
      allowNull: true,
    },
    bulan: {
      type: DataTypes.CHAR(6),
      allowNull: true,
    },
    uang: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    alias: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    waktu: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Ref_pencabutan;

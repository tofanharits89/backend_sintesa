import { DataTypes } from "sequelize";
import db from "../../config/Database8.js";

const byPetugasProvModel = db.define(
  "by_petugas_prov",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    wilayah: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    detail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    jenis: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    kodeWil: {
      type: DataTypes.STRING(50),
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
  },
  {
    tableName: "by_petugas_prov",
    timestamps: false,
  }
);

export default byPetugasProvModel;

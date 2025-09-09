import { Sequelize } from "sequelize";
import db from "../../config/DatabaseEPA.js";

const { DataTypes } = Sequelize;

const IsuSpesifik = db.define(
  "IsuSpesifik",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    thang: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    periode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    isu: {
      type: DataTypes.TEXT(345),
      allowNull: false,
    },
    kdkanwil: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    kdlokasi: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    kdddept: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    keyId: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "isu_spesifik",
    timestamps: true, // Sequelize akan otomatis mengisi createdAt & updatedAt
  }
);

export default IsuSpesifik;

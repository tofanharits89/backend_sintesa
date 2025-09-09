import { Sequelize } from "sequelize";
import db from "../../config/DatabaseEPA.js";
const { DataTypes } = Sequelize;

const Analisa = db.define(
  "analisa",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    thang: {
      type: DataTypes.CHAR(4),
      allowNull: true,
    },
    periode: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    kddept: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    kdkanwil: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    selectedProgram: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    selectedPoint: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    selectedSubPoint: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    selectedRo: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    kategori: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    urgency: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    seriousness: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    growth: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    rencanaAksi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    approval: {
      type: DataTypes.STRING(10),
      allowNull: true,
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
    tableName: "analisa",
    timestamps: false,
  }
);

export default Analisa;

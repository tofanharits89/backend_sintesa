import { Sequelize } from "sequelize";
import db from "../../config/Database8.js";
const { DataTypes } = Sequelize;

const EWSTrend2025 = db.define(
  "ews_trend_2025",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kdkanwil: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    nmkanwil: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2025,
    },
    triwulan: {
      type: DataTypes.ENUM("I", "II", "III", "IV"),
      allowNull: false,
    },
    D1: { type: DataTypes.TINYINT },
    D2: { type: DataTypes.TINYINT },
    D3: { type: DataTypes.TINYINT },
    D4: { type: DataTypes.TINYINT },
    N1: { type: DataTypes.TINYINT },
    N2: { type: DataTypes.TINYINT },
    I1: { type: DataTypes.TINYINT },
    I2: { type: DataTypes.TINYINT },
    K1: { type: DataTypes.TINYINT },
    K2: { type: DataTypes.TINYINT },
    K3: { type: DataTypes.TINYINT },
    K4: { type: DataTypes.TINYINT },
    K5: { type: DataTypes.TINYINT },
    total_score: { type: DataTypes.INTEGER },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "ews_trend_2025",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default EWSTrend2025;

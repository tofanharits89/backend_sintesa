import { DataTypes } from "sequelize";
import db from "../../config/Database8.js";

const spasialModel = db.define(
  "data_spasial_mbg",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    kode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    kanwil: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    jan: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    feb: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    mar: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    apr: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    mei: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    jun: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    jul: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    agt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    sep: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    okt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    nov: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    des: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    total: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    regional: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    kdkanwil: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
  },
  {
    tableName: "data_spasial_mbg",
    timestamps: false,
  }
);

export default spasialModel;
export async function syncSpasialModel() {
  try {
    await spasialModel.sync({ alter: true });
    console.log("Spasial model synced successfully.");
  } catch (error) {
    console.error("Error syncing spasial model:", error);
  }
}
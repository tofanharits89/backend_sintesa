// models/konsumsiMbgModel.js
import { DataTypes } from "sequelize";
import db from "../../config/Database8.js";

const KonsumsiMbg = db.define(
  "konsumsi_mbg",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    provinsi: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },    konsumsi_makanan: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    total_penerima: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sd_sederajat: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },
    total: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    ntp: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
  },
  {
    tableName: "konsumsi_mbg",
    timestamps: false,
  }
);

export default KonsumsiMbg;

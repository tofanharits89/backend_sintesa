import { DataTypes } from "sequelize";
import db from "../../config/Database8.js";

const kelompokMbgModel = db.define(
  "kelompok_mbg",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    kelompok: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    jumlah: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "kelompok_mbg",
    timestamps: false,
  }
);

export default kelompokMbgModel;

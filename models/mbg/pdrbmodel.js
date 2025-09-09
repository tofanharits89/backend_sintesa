import { DataTypes } from "sequelize";
import db from "../../config/Database8.js";

const pdrbmodel = db.define(
  "pdrb_lu_tw_2024",
  {
    kode_kanwil: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    nama_kanwil: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    provinsi: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    kategori: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tw1: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    tw2: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    tw3: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    tw4: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    tahunan: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  },
  {
    tableName: "pdrb_lu_tw_2024",
    timestamps: false,
  }
);

export default pdrbmodel;

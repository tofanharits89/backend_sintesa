import { Sequelize } from "sequelize";
import db from "../../config/Database8.js";
const { DataTypes } = Sequelize;

const kesimpulan_saran = db.define(
  "kesimpulan_saran",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kode_kanwil: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    kesimpulan: {
      type: DataTypes.STRING(765),
      allowNull: true,
    },
    triwulan: {
      type: DataTypes.STRING(9),
      allowNull: true,
    },
    tahun: {
      type: DataTypes.INTEGER, // Atau DataTypes.STRING(4) jika kamu ingin fleksibel
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"), // Untuk mencerminkan `on update current_timestamp()`
    },
    saran: {
      type: DataTypes.STRING(765),
      allowNull: true,
    },
  },
  {
    tableName: "kesimpulan_saran",
    timestamps: false, // karena kita handle `createdAt` dan `updatedAt` manual
  }
);

export default kesimpulan_saran;

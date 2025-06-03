// models/replypesan.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const ReplyPesan = db.define("reply_pesan", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  notifikasi_id: { type: DataTypes.INTEGER, allowNull: false },
  parent_id: { type: DataTypes.INTEGER, allowNull: true }, // <--- tambahkan ini!
  dari: { type: DataTypes.STRING, allowNull: false },
  isi: { type: DataTypes.TEXT, allowNull: false },
  filename: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  freezeTableName: true,
  timestamps: false,
});

export default ReplyPesan;

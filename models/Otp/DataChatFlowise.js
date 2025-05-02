import { Sequelize } from "sequelize";
import db from "../../config/DatabaseBOT.js";

const { DataTypes } = Sequelize;

const DataChatFlowise_Model = db.define(
  "chats",
  {
    id: {
      type: DataTypes.INTEGER, // Menggunakan tipe INTEGER tanpa panjang (auto-increment)
      allowNull: false,
      primaryKey: true, // Menjadikan id sebagai primary key
      autoIncrement: true, // Menambahkan auto-increment
    },
    chat_id: {
      type: DataTypes.STRING(120), // Menggunakan tipe STRING dengan panjang 120
      allowNull: true,
    },
    nama: {
      type: DataTypes.STRING(120), // Menggunakan tipe STRING dengan panjang 120
      allowNull: true,
    },
  },
  {
    tableName: "chats", // Nama tabel yang akan digunakan di database
    timestamps: true, // Menambahkan kolom createdAt dan updatedAt
  }
);

export default DataChatFlowise_Model;

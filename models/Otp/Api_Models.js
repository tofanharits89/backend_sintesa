import { Sequelize } from "sequelize";
import db from "../../config/DatabaseBOT.js";

const { DataTypes } = Sequelize;

const Api_Model = db.define(
  "api",
  {
    id: {
      type: DataTypes.INTEGER, // Menggunakan tipe INTEGER tanpa panjang (auto-increment)
      allowNull: false,
      primaryKey: true, // Menjadikan id sebagai primary key
      autoIncrement: true, // Menambahkan auto-increment
    },
    api: {
      type: DataTypes.STRING(120), // Menggunakan tipe STRING dengan panjang 120
      allowNull: true,
    },
    jenis: {
      type: DataTypes.STRING(120), // Menggunakan tipe STRING dengan panjang 120
      allowNull: true,
    },
  },
  {
    tableName: "api", // Nama tabel yang akan digunakan di database
    timestamps: true, // Menambahkan kolom createdAt dan updatedAt
  }
);

export default Api_Model;

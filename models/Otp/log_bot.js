import { Sequelize } from "sequelize";
import db from "../../config/Database.js";

const { DataTypes } = Sequelize;

const Log_bot_Model = db.define("log_bot", {
  id: {
    type: DataTypes.INTEGER(120), // Menentukan tipe INTEGER dengan panjang 120
    allowNull: false,
    primaryKey: true, // Menjadikan id sebagai primary key
    autoIncrement: true, // Menambahkan auto-increment
  },

  user: {
    type: DataTypes.STRING(120), // Menggunakan tipe VARCHAR dengan panjang 120
    allowNull: true,
  },
  menu: {
    type: DataTypes.STRING(120), // Menggunakan tipe VARCHAR dengan panjang 120
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(120), // Menggunakan tipe VARCHAR dengan panjang 120
    allowNull: true,
  },
});
export default Log_bot_Model;

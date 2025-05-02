import { Sequelize } from "sequelize";
import db from "../../config/DatabaseBOT.js";

const { DataTypes } = Sequelize;

const Otp_Models = db.define("pin_pendings", {
  id: {
    type: DataTypes.INTEGER(120), // Menentukan tipe INTEGER dengan panjang 120
    allowNull: false,
    primaryKey: true, // Menjadikan id sebagai primary key
    autoIncrement: true, // Menambahkan auto-increment
  },

  username: {
    type: DataTypes.STRING(120), // Menggunakan tipe VARCHAR dengan panjang 120
    allowNull: true,
  },
  nomor: {
    type: DataTypes.STRING(120), // Menggunakan tipe VARCHAR dengan panjang 120
    allowNull: true,
  },
  nama: {
    type: DataTypes.STRING(120), // Menggunakan tipe VARCHAR dengan panjang 120
    allowNull: true,
  },
  otp: {
    type: DataTypes.CHAR(4), // Menggunakan tipe CHAR dengan panjang 4
    allowNull: true,
  },
  pin: {
    type: DataTypes.CHAR(6), // Menggunakan tipe CHAR dengan panjang 6
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(20), // Menggunakan tipe VARCHAR dengan panjang 20
    allowNull: true,
  },
});
export default Otp_Models;

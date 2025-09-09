import { Sequelize } from "sequelize";
import db from "../../config/Database8.js";
const { DataTypes } = Sequelize;

const Permasalahan = db.define(
  "permasalahan",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kode_kanwil: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    kategori: {
      type: DataTypes.STRING(765),
      allowNull: false,    },
    triwulan: {
      type: DataTypes.CHAR(9),
      allowNull: false,
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.STRING(765),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "permasalahan",
    timestamps: true,
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
  }
);

export default Permasalahan;

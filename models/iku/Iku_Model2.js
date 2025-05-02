import { Sequelize } from "sequelize";
import db from "../../config/DatabaseTkd.js";

const { DataTypes } = Sequelize;

const Iku_Model2 = db.define(
  "iku_monev_kanwil_ii",
  {
    kdkanwil: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    thang: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    periode: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    ringkasan: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    penyusunan: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    metode: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    kualitasdd: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    kualitasdf: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    kualitasbos: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    kesimpulan: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    hasil: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    ket: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.CHAR(1),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Iku_Model2;

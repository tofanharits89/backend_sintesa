import { Sequelize } from "sequelize";
import db from "../../config/Database3.js";

const { DataTypes } = Sequelize;

const WeeklyModel = db.define(
  "data_weekly",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    tahun: {
      type: DataTypes.CHAR(4),
      allowNull: true,
    },
    periode: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    bulan: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    tglawal: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tglakhir: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nmbulan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    file: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  }
);

export default WeeklyModel;

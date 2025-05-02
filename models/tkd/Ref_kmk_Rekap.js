import { Sequelize } from "sequelize";
import db from "../../config/DatabaseTkd.js";

const { DataTypes } = Sequelize;

const Rekap = db.define(
  "rekap",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    thang: {
      type: DataTypes.CHAR(12),
      allowNull: true,
    },
    bulan: {
      type: DataTypes.CHAR(6),
      allowNull: true,
    },
    kdkppn: {
      type: DataTypes.CHAR(9),
      allowNull: true,
    },
    nmkppn: {
      type: DataTypes.STRING(84),
      allowNull: true,
    },
    kdpemda: {
      type: DataTypes.CHAR(12),
      allowNull: true,
    },
    nmpemda: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    nmbulan: {
      type: DataTypes.STRING(72),
      allowNull: true,
    },
    pagu: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    alokasi_bulan: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    tunda: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    cabut: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    potongan: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    salur: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    kdkanwil: {
      type: DataTypes.CHAR(6),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Rekap;

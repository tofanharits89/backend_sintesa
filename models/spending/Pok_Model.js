import { Sequelize } from "sequelize";
import db from "../../config/Database6.js";

const { DataTypes } = Sequelize;

const Pok_Model = db.define(
  "dt_pok_2024",
  {
    thang: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    kddept: {
      type: DataTypes.CHAR(9),
      allowNull: true,
    },
    kdunit: {
      type: DataTypes.CHAR(6),
      allowNull: true,
    },
    kdsatker: {
      type: DataTypes.CHAR(18),
      allowNull: true,
    },
    kddekon: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    kdindex: {
      type: DataTypes.STRING(477),
      allowNull: true,
    },
    kode: {
      type: DataTypes.STRING(33),
      allowNull: true,
    },
    uraian: {
      type: DataTypes.STRING(750),
      allowNull: true,
    },
    volkeg: {
      type: DataTypes.STRING(36),
      allowNull: true,
    },
    satkeg: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    hargasat: {
      type: DataTypes.STRING(48),
      allowNull: true,
    },
    pagu: {
      type: DataTypes.DECIMAL(38, 0),
      allowNull: true,
    },
    data_level: {
      type: DataTypes.STRING(18),
      allowNull: true,
    },
    id_level: {
      type: DataTypes.STRING(18),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    status2: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    blokir: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    flag_alert: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    header: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Pok_Model;

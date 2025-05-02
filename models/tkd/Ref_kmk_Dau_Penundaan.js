import { Sequelize } from "sequelize";
import db from "../../config/DatabaseTkd.js";

const { DataTypes } = Sequelize;

const Ref_kmk_Penundaan_Model = db.define(
  "ref_kmk_penundaan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    thang: {
      type: DataTypes.CHAR(12),
      allowNull: true,
    },
    jenis: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    kriteria: {
      type: DataTypes.CHAR(6),
      allowNull: true,
    },
    no_kmk: {
      type: DataTypes.STRING(384),
      allowNull: true,
    },
    uraian: {
      type: DataTypes.STRING(384),
      allowNull: true,
    },
    kdkppn: {
      type: DataTypes.CHAR(9),
      allowNull: true,
    },
    kdpemda: {
      type: DataTypes.CHAR(12),
      allowNull: true,
    },
    jan: {
      type: DataTypes.DECIMAL(21, 0),
      allowNull: true,
    },
    peb: {
      type: DataTypes.DECIMAL(21, 0),
      allowNull: true,
    },
    mar: {
      type: DataTypes.DECIMAL(21, 0),
      allowNull: true,
    },
    apr: {
      type: DataTypes.DECIMAL(21, 0),
      allowNull: true,
    },
    mei: {
      type: DataTypes.DECIMAL(21, 0),
      allowNull: true,
    },
    jun: {
      type: DataTypes.DECIMAL(21, 0),
      allowNull: true,
    },
    jul: {
      type: DataTypes.DECIMAL(21, 0),
      allowNull: true,
    },
    ags: {
      type: DataTypes.DECIMAL(21, 0),
      allowNull: true,
    },
    sep: {
      type: DataTypes.DECIMAL(21, 0),
      allowNull: true,
    },
    okt: {
      type: DataTypes.DECIMAL(21, 0),
      allowNull: true,
    },
    nov: {
      type: DataTypes.DECIMAL(21, 0),
      allowNull: true,
    },
    des: {
      type: DataTypes.DECIMAL(21, 0),
      allowNull: true,
    },
    alias: {
      type: DataTypes.STRING(384),
      allowNull: true,
    },
    update_data: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status_cabut: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    kmk_cabut: {
      type: DataTypes.STRING(384),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Ref_kmk_Penundaan_Model;

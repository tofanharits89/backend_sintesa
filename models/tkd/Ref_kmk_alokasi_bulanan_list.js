import { Sequelize } from "sequelize";
import db from "../../config/DatabaseTkd.js";

const { DataTypes } = Sequelize;

const Ref_kmk_Alokasi_bulanan_List = db.define(
  "alokasi_bulanan_list",
  {
    id: {
      type: DataTypes.INTEGER(120),
      allowNull: true,
      primaryKey: true,
    },
    thang: {
      type: DataTypes.CHAR(12),
      allowNull: true,
    },
    kdpemda: {
      type: DataTypes.CHAR(12),
      allowNull: true,
    },
    nmpemda: {
      type: DataTypes.STRING(384),
      allowNull: true,
    },
    kdsatker_pemda: {
      type: DataTypes.CHAR(18),
      allowNull: true,
    },
    kdkppn: {
      type: DataTypes.CHAR(9),
      allowNull: true,
    },
    nmkppn: {
      type: DataTypes.STRING(384),
      allowNull: true,
    },
    kdsatker_bun: {
      type: DataTypes.CHAR(18),
      allowNull: true,
    },
    dau_tidak_ditentukan: {
      type: DataTypes.DECIMAL(22, 0),
      allowNull: true,
    },
    bulan: {
      type: DataTypes.CHAR(6),
      allowNull: true,
    },
    alokasi: {
      type: DataTypes.DECIMAL(22, 0),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Ref_kmk_Alokasi_bulanan_List;

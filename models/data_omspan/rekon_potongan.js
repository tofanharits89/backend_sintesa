import { Sequelize } from "sequelize";
import db from "../../config/DatabaseOmspan.js";

const { DataTypes } = Sequelize;

const Rekon_potongan = db.define(
  "rekon_potongan",
  {
    bulan: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    kdkppn: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    kdpemda: {
      type: DataTypes.CHAR(4),
      allowNull: true,
    },
    akun_pusat: {
      type: DataTypes.CHAR(6),
      allowNull: true,
    },
    nilai_pusat: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },
    akun_omspan: {
      type: DataTypes.DECIMAL(6, 0),
      allowNull: true,
    },
    nilai_omspan: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Rekon_potongan;

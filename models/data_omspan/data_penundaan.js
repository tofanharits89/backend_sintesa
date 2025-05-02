import { Sequelize } from "sequelize";
import db from "../../config/DatabaseOmspan.js";

const { DataTypes } = Sequelize;

const Penundaan_Model = db.define(
  "data_penundaan",
  {
    THANG: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    PERIODE: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    GELOMBANG: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    KODE_PEMDA: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    JENIS_TKD: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    NILAI_PENUNDAAN: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    NOMOR_ND: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    TANGGAL_ND: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    NAMA_PERIODE: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    NAMA_DETAIL: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    NM_LOKASI: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    KODE_KANWIL: {
      type: DataTypes.STRING(2),
    },
    KODE_KPPN: {
      type: DataTypes.STRING(3),
    },
  },
  {
    freezeTableName: true,
  }
);

export default Penundaan_Model;

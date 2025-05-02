import { Sequelize } from "sequelize";
import db from "../../config/DatabaseTkd.js";

const { DataTypes } = Sequelize;

const UploadKanwilModel = db.define(
  "upload_data_kanwil",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tahun: {
      type: DataTypes.CHAR(4),
      allowNull: true,
    },
    kdkanwil: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    jenis: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    periode: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },

    file: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    filename: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tipe: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ukuran: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    createdatetime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    catatan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    waktu: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fileasli: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    nilai: {
      type: DataTypes.STRING(111),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  }
);

export default UploadKanwilModel;

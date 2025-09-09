import { Sequelize } from "sequelize";
import db from "../../config/DatabaseEPA.js";

const { DataTypes } = Sequelize;

const KinerjaUtama = db.define(
  "kinerja_utama",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    thang: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    periode: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    kdkanwil: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    kdlokasi: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    kdddept: {
      type: DataTypes.STRING(3),
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    jenis: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    judul: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    keyId: {
      type: DataTypes.STRING(45),
      allowNull: true,
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
    tableName: "kinerja_utama",
    timestamps: true, // Sequelize akan otomatis mengisi createdAt & updatedAt
  }
);

export default KinerjaUtama;

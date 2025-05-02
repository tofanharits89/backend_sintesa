import { Sequelize } from "sequelize";
import db from "../config/Database3.js";

const { DataTypes } = Sequelize;

const Lampiran = db.define(
  "dispensasi_spm_lampiran",
  {
    id_dispensasi: {
      type: DataTypes.CHAR(250),
    },
    thang: {
      type: DataTypes.CHAR(4),
    },

    kdsatker: {
      type: DataTypes.CHAR(6),
    },
    tgpermohonan: {
      type: DataTypes.DATE,
    },
    nopermohonan: {
      type: DataTypes.CHAR(250),
    },
    nospm: {
      type: DataTypes.CHAR(150),
    },
    tgspm: {
      type: DataTypes.DATE,
    },
    nilspm: {
      type: DataTypes.DECIMAL(20, 0),
    },
    tgbast: {
      type: DataTypes.DATE,
    },
    nobast: {
      type: DataTypes.CHAR(250),
    },
    status: {
      type: DataTypes.STRING,
    },
    kd_dispensasi: {
      type: DataTypes.STRING,
    },
    rpata: {
      type: DataTypes.STRING,
    },
    cara_upload: {
      type: DataTypes.CHAR(9),
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  }
);

// Optional: Define associations with other models if needed

export default Lampiran;

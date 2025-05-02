import { Sequelize } from "sequelize";
import db from "../config/Database3.js";

const { DataTypes } = Sequelize;

const Lampiran_Tup = db.define(
  "dispensasi_tup_lampiran",
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
    notup: {
      type: DataTypes.CHAR(150),
    },
    tgtup: {
      type: DataTypes.DATE,
    },
    niltup: {
      type: DataTypes.DECIMAL(20, 0),
    },
    status: {
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

export default Lampiran_Tup;

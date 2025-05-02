import { Sequelize } from "sequelize";
import db from "../../config/Database3.js";

const { DataTypes } = Sequelize;

const LampiranKPPN_Kontrak = db.define(
  "dispensasi_kppn_lampiran",
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
    nokontrak: {
      type: DataTypes.CHAR(150),
    },
    tgkontrak: {
      type: DataTypes.DATE,
    },
    kdkppn: {
      type: DataTypes.CHAR(3),
    },
    nilkontrak: {
      type: DataTypes.DECIMAL(20, 0),
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  }
);

// Optional: Define associations with other models if needed

export default LampiranKPPN_Kontrak;

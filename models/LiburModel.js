import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Libur = db.define(
  "data_libur",
  {
    TGL_LIBUR: {
      type: DataTypes.DATE(),
    },
    KETERANGAN: {
      type: DataTypes.STRING,
    },
    INSERTED: {
      type: DataTypes.STRING,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Libur;

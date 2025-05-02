import { Sequelize } from "sequelize";
import db from "../../config/DatabaseOmspan.js";

const { DataTypes } = Sequelize;

const Data_beda = db.define(
  "data_beda",
  {
    thang: {
      type: DataTypes.STRING(4),
    },
    periode: {
      type: DataTypes.STRING(2),
    },

    kdpemda: {
      type: DataTypes.STRING(4),
    },
  },
  {
    freezeTableName: true,
  }
);

export default Data_beda;

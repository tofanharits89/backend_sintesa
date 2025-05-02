import { Sequelize } from "sequelize";
import db from "../../config/Database6.js";

const { DataTypes } = Sequelize;

const Status_Model = db.define(
  "ref_satker_dipa_2024",
  {
    kddept: {
      type: DataTypes.CHAR(9),
      defaultValue: null,
    },
    kdunit: {
      type: DataTypes.CHAR(6),
      defaultValue: null,
    },
    kdsatker: {
      type: DataTypes.CHAR(18),
      defaultValue: null,
    },
    kddekon: {
      type: DataTypes.CHAR(3),
      defaultValue: null,
    },
    kdlokasi: {
      type: DataTypes.CHAR(6),
      defaultValue: null,
    },
    kdkppn: {
      type: DataTypes.CHAR(9),
      defaultValue: null,
    },
    nmsatker: {
      type: DataTypes.STRING(200),
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING(6),
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Status_Model;

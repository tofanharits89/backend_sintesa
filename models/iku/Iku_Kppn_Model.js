import { Sequelize } from "sequelize";
import db from "../../config/DatabaseTkd.js";

const { DataTypes } = Sequelize;

const Iku_Kppn_Model = db.define(
  "iku_lk_kppn",
  {
    thang: {
      type: DataTypes.CHAR(4),
      defaultValue: null,
    },
    kdkppn: {
      type: DataTypes.CHAR(3),
      defaultValue: null,
    },
    periode: {
      type: DataTypes.CHAR(2),
      defaultValue: null,
    },
    sahlengkap: {
      type: DataTypes.DECIMAL(15, 0),
      defaultValue: null,
    },
    sahsesuai: {
      type: DataTypes.DECIMAL(15, 0),
      defaultValue: null,
    },
    jelaslengkap: {
      type: DataTypes.DECIMAL(15, 0),
      defaultValue: null,
    },
    jelassesuai: {
      type: DataTypes.DECIMAL(15, 0),
      defaultValue: null,
    },
    tabellengkap: {
      type: DataTypes.DECIMAL(15, 0),
      defaultValue: null,
    },
    tabelsesuai: {
      type: DataTypes.DECIMAL(15, 0),
      defaultValue: null,
    },
    calklengkap: {
      type: DataTypes.DECIMAL(15, 0),
      defaultValue: null,
    },
    calksesuai: {
      type: DataTypes.DECIMAL(15, 0),
      defaultValue: null,
    },
    lamplengkap: {
      type: DataTypes.DECIMAL(15, 0),
      defaultValue: null,
    },
    lampsesuai: {
      type: DataTypes.DECIMAL(15, 0),
      defaultValue: null,
    },
    hasil: {
      type: DataTypes.DECIMAL(15, 0),
      defaultValue: null,
    },
    keterangan: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Iku_Kppn_Model;

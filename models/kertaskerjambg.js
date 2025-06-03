import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const KertasKerjaMBG = db.define("kertas_kerja_mbg", {
  tahun: DataTypes.STRING,
  kanwil: DataTypes.STRING,
  triwulan: DataTypes.STRING,
  indikator: DataTypes.STRING,
  satuan: DataTypes.STRING,
  keterangan: DataTypes.STRING,
}, {
  freezeTableName: true,
  timestamps: false,
});

export default KertasKerjaMBG;

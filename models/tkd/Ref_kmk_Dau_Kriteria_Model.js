import { Sequelize } from "sequelize";
import db from "../config/DatabaseTkd.js";

const { DataTypes } = Sequelize;

const Ref_kmk_Dau_Kriteria_Model = db.define(
    "ref_kmk_dau_kriteria",
    {
        id: {
            type: DataTypes.STRING(84), // Tipe CHAR dengan panjang 84
        },
        id_kriteria: {
            type: DataTypes.STRING(84), // Tipe CHAR dengan panjang 84
        },
        nm_kriteria: {
            type: DataTypes.STRING(384), // Tipe VARCHAR dengan panjang 384
        },
        kunci: {
            type: DataTypes.STRING(6), // Tipe CHAR dengan panjang 6
        },
    },
    {
        freezeTableName: true,
    }
);

export default Ref_kmk_Dau_Kriteria_Model;

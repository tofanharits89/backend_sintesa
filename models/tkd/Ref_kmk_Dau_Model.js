import { Sequelize } from "sequelize";
import db from "../../config/DatabaseTkd.js";

const { DataTypes } = Sequelize;

const Ref_kmk_Dau_Model = db.define(
    "ref_kmk_dau",
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        thang: {
            type: DataTypes.STRING,
        },
        no_kmk: {
            type: DataTypes.STRING,
        },
        tgl_kmk: {
            type: DataTypes.STRING,
        },
        jenis: {
            type: DataTypes.STRING,
        },
        kriteria: {
            type: DataTypes.STRING,
        },
        uraian: {
            type: DataTypes.STRING,
        },
        thangcabut: {
            type: DataTypes.STRING,
        },
        no_kmkcabut: {
            type: DataTypes.STRING,
        },
        tglcabut: {
            type: DataTypes.STRING,
        },
        uraiancabut: {
            type: DataTypes.STRING,
        },
        status_cabut: {
            type: DataTypes.STRING,
        },
        kdkppn: {
            type: DataTypes.STRING,
        },
        kdpemda: {
            type: DataTypes.STRING,
        },
        filekmk: {
            type: DataTypes.STRING,
        },
    },
    {
        freezeTableName: true,
    }
);

export default Ref_kmk_Dau_Model;

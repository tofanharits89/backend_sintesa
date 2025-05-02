import { Sequelize } from "sequelize";
import db from "../../config/DatabaseTkd.js";

const { DataTypes } = Sequelize;

const Ref_kmk_Detail_Model = db.define(
    "detail_kmk_dau", // Replace with your desired table name
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        thang: {
            type: DataTypes.CHAR(12),

        },
        bulan: {
            type: DataTypes.CHAR(6),

        },
        jenis_kmk: {
            type: DataTypes.CHAR(6),

        },
        kriteria: {
            type: DataTypes.STRING(6),

        },
        no_kmk: {
            type: DataTypes.STRING(384),

        },
        kdkppn: {
            type: DataTypes.CHAR(9),

        },
        kdkabkota: {
            type: DataTypes.CHAR(12),

        },
        kdakun: {
            type: DataTypes.CHAR(18),

        },
        kdsatker: {
            type: DataTypes.CHAR(18),

        },
        kdlokasi: {
            type: DataTypes.CHAR(12),

        },
        nilai: {
            type: DataTypes.DECIMAL(23, 0),

        },
        update_data: {
            type: DataTypes.DATE,

        },
        nmbulan: {
            type: DataTypes.STRING(384),

        },
    },
    {
        freezeTableName: true,
    }
);

export default Ref_kmk_Detail_Model;

import { Sequelize } from "sequelize";
import db from "../../config/DatabaseTkd.js";

const { DataTypes } = Sequelize;

const Ref_kmk_Cabut_Model = db.define(
    "ref_kmk_cabut",
    {
        tgltunda: {
            type: DataTypes.STRING,
        },

        kmktunda: {
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
    },
    {
        freezeTableName: true,
    }
);

export default Ref_kmk_Cabut_Model;



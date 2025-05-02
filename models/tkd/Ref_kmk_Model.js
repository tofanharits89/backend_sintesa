import { Sequelize } from "sequelize";
import db from "../config/DatabaseTkd.js";

const { DataTypes } = Sequelize;

const Ref_kmk_Model = db.define(
    "ref_kmk",
    {
        jenis: {
            type: DataTypes.STRING,
        },

        nmjenis: {
            type: DataTypes.STRING,
        },
    },
    {
        freezeTableName: true,
    }
);

export default Ref_kmk_Model;

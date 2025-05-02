import { Sequelize } from "sequelize";
import db from "../../config/Database5.js";

const { DataTypes } = Sequelize;

const Ref_dbref = db.define(
    "t_dept_2023",
    {

    },
    {
        freezeTableName: true,
    }
);

export default Ref_dbref;



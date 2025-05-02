import { Sequelize } from "sequelize";
import db from "../config/Database3.js";

const { DataTypes } = Sequelize;

const DispenBlokir = db.define(
    "target_blokir_perjadin",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        kddept: {
            type: DataTypes.CHAR(3),
            allowNull: true,
        },
        kdunit: {
            type: DataTypes.CHAR(2),
            allowNull: true,
        },
        target: {
            type: DataTypes.DECIMAL(21, 0),
            allowNull: true,
        },
        dispensasi_blokir: {
            type: DataTypes.DECIMAL(21, 0),
            allowNull: true,
        },
        blokir_7: {
            type: DataTypes.DECIMAL(21, 0),
            allowNull: true,
        },
        blokir_A: {
            type: DataTypes.DECIMAL(21, 0),
            allowNull: true,
        },
        deviasi: {
            type: DataTypes.DECIMAL(21, 0),
            allowNull: true,
        },
    },
    {
        freezeTableName: true,
        tableName: "target_blokir_perjadin", // Nama tabel di database
        timestamps: false,            // Nonaktifkan kolom createdAt dan updatedAt
    }
);

export default DispenBlokir;

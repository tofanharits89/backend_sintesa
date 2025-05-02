import Satker from "../models/Satker.js";
import { decryptData } from "../middleware/Decrypt.js";
import Log_menu from "../models/Log_menu.js";
import db from "../config/Database3.js";
import Sequelize from "sequelize";
import moment from "moment-timezone";
import ioServer from "../index.js";
import fs from "fs";
import multer from "multer";
import path from "path";
import { error } from "console";
import Users from "../models/UserModel.js";
import DispenBlokir from "../models/MonitoringBlokir.js";

export const tayangMonitoringBlokir = async (req, res) => {
    const queryParams = req.query.queryParams;
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 0;
    const offset = page * limit;

    try {
        const decryptedData = decryptData(queryParams).replace(/"/g, "");

        // Log decrypted data for debugging
        console.log("Decrypted Data:", decryptedData);

        const resultsQuery = `${decryptedData} LIMIT :limit OFFSET :offset`;
        const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${decryptedData}) AS totalCountSubquery`;

        const totalDataQuery = `
            SELECT 
                SUM(target_blokir) AS totalTargetBlokir, 
                SUM(dispensasi_blokir) AS totalDispenBlokir,
                SUM(sudah_blokir) AS totalNilaiBlokir, 
                SUM(sisa) AS totalSisaBlokir 
            FROM (${decryptedData}) AS totalDataSubquery
        `;

        const [results, totalCountResult, totalDataResult] = await Promise.all([
            db.query(resultsQuery, {
                type: Sequelize.QueryTypes.SELECT,
                replacements: { limit, offset },
            }),
            db.query(totalCountQuery, {
                type: Sequelize.QueryTypes.SELECT,
            }),
            db.query(totalDataQuery, {
                type: Sequelize.QueryTypes.SELECT,
            }),
        ]);

        const totalCount = totalCountResult[0]?.totalCount ?? 0;
        const totalTargetBlokir = totalDataResult[0]?.totalTargetBlokir ?? 0;
        const totalDispenBlokir = totalDataResult[0]?.totalDispenBlokir ?? 0;
        const totalNilaiBlokir = totalDataResult[0]?.totalNilaiBlokir ?? 0;
        const totalSisaBlokir = totalDataResult[0]?.totalSisaBlokir ?? 0;

        res.json({
            result: results,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalCount / limit),
            totalRows: totalCount,
            totalTargetBlokir,
            totalDispenBlokir,
            totalNilaiBlokir,
            totalSisaBlokir,
        });

        const clientIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        await Log_menu.create({
            ip: clientIP,
            username: req.query.user,
            nm_menu: "MONITORING_BLOKIR",
        });

        ioServer.emit(
            "running_querys",
            "dispensasi, IP: " + clientIP + " username: " + req.query.user + " data : " + JSON.stringify(results).slice(0, 150)
        );
    } catch (error) {
        console.error("Error executing tayangMonitoringBlokir:", error);
        ioServer.emit("error_querys", "tayang dispensasi" + (error.original?.sqlMessage || error.message));
        res.status(500).json({
            error: error.original?.sqlMessage || error.message,
        });
    }
};

export const tayangMonitoringBlokirSatker = async (req, res) => {
    const queryParams = req.query.queryParams;
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 0;
    const offset = page * limit;

    const decryptedData = decryptData(queryParams).replace(/"/g, "");

    try {
        const resultsQuery = `${decryptedData}  LIMIT ${limit} OFFSET ${offset}`;
        const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${decryptedData}) AS totalCountSubquery`;

        const [results, totalCountResult] = await Promise.all([
            db.query(resultsQuery, {
                type: Sequelize.QueryTypes.SELECT,
                replacements: {
                    limit,
                    offset,
                },
            }),
            db.query(totalCountQuery, {
                type: Sequelize.QueryTypes.SELECT,
            }),
        ]);

        const totalCount = totalCountResult[0].totalCount;

        res.json({
            result: results,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalCount / limit),
            totalRows: totalCount,
        });
        const clientIP =
            req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        await Log_menu.create({
            ip: clientIP,
            username: req.query.user,
            nm_menu: "MONITORING_BLOKIR_SATKER",
        });
    } catch (error) {
        res.status(500).json({
            error: error.original.sqlMessage,
        });
    }
};

export const editDispenBlokir = async (req, res) => {
    try {
        const { id, dispensasi_blokir } = req.body;

        // Validasi input
        if (!id || dispensasi_blokir === undefined) {
            return res.status(400).json({
                success: false,
                message: "ID and dispensasi_blokir are required.",
            });
        }

        // Update kolom dispensasi_blokir
        const dispensasi = await DispenBlokir.update(
            { dispensasi_blokir },
            { where: { id } }
        );

        // Jika tidak ada baris yang diperbarui
        if (dispensasi[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "No record found with the given ID.",
            });
        }

        // console.log("Updated dispensasi_blokir:", dispensasi);
        return res.status(200).json({
            success: true,
            message: "Data updated successfully.",
        });
    } catch (error) {
        console.error("Error updating dispensasi_blokir:", error);
        return res.status(500).json({
            success: false,
            error: error.original?.sqlMessage || error.message || "Internal server error",
        });
    }
};
import Harmonisasi from "../models/Harmonisasi.js";
import { decryptData } from "../middleware/Decrypt.js";
import db from "../config/Database.js";
import Sequelize from "sequelize";
import Log_menu from "../models/Log_menu.js";
import ioServer from "../index.js";

export const simpanHarmon = async (req, res) => {
  const { id, selectedClustersStr, jenis, keterangan } = req.body;

  try {
    await Harmonisasi.update(
      { [`c${jenis}`]: selectedClustersStr, [`ket${jenis}`]: keterangan },
      { where: { id: id } } // Ganti 'id' sesuai dengan primary key yang sesuai dengan data yang ingin Anda perbarui
    );

    res.json({ msg: "Data Insert Berhasil" });
    ioServer.emit("running_querys", "simpan harmonisasi [status:berhasil]");
  } catch (error) {
    console.log(error);
  }
};

export const harmonisasi2 = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = ` ${decryptedData} LIMIT ${limit} OFFSET ${offset}
    
`;

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
      nm_menu: "HARMONISASI",
    });
    ioServer.emit("running_querys", "tayang harmonisasi [status:berhasil]");
  } catch (error) {
    res.status(500).json({
      error: error.original.sqlMessage,
    });
  }
};

export const HarmonisasiQuery = async (req, res) => {
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
      nm_menu: "HARMONISASI",
    });
  } catch (error) {
    res.status(500).json({
      error: error.original.sqlMessage,
    });
  }
};

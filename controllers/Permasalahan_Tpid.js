import Tpid from "../models/Permasalahan_Tpid.js";
import { decryptData } from "../middleware/Decrypt.js";
import db from "../config/Database3.js";
import Sequelize from "sequelize";
import Log_menu from "../models/Log_menu.js";
import ioServer from "../index.js";

export const simpanTpid = async (req, res) => {
  const { id, jenis, keterangan, rekomendasi } = req.body;
  // console.log(req.body);
  try {
    await Tpid.update(
      { [`ket${jenis}_kl`]: keterangan, [`rekom${jenis}_kl`]: rekomendasi, [`ket${jenis}_tkd`]: keterangan, [`rekom${jenis}_tkd`]: rekomendasi },
      { where: { id: id } } // Ganti 'id' sesuai dengan primary key yang sesuai dengan data yang ingin Anda perbarui
    );

    res.json({ msg: "Data Insert Berhasil" });
    ioServer.emit("running_querys", "simpan permasalahan tpid [status:berhasil]");
  } catch (error) {
    console.log(error);
  }
};

export const tpid = async (req, res) => {
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
      nm_menu: "TPID",
    });
    ioServer.emit("running_querys", "tayang permasalahan tpid [status:berhasil]");
  } catch (error) {
    res.status(500).json({
      error: error.original.sqlMessage,
    });
  }
};

export const TpidQuery = async (req, res) => {
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
      nm_menu: "TPID",
    });
  } catch (error) {
    res.status(500).json({
      error: error.original.sqlMessage,
    });
  }
};

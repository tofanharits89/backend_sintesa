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
import MonevPnbp from "../models/MonevPnbp.js";
import Module from "module";

export const tayangMonevPnbp = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decryptData(queryParams).replace(/"/g, "");

  try {
    const resultsQuery = `${decryptedData}  LIMIT ${limit} OFFSET ${offset}`;
    const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${decryptedData}) AS totalCountSubquery`;
    // console.log(resultsQuery);
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
      nm_menu: "MONEVPNBP",
    });
    ioServer.emit(
      "running_querys",
      "monev_pnbp, IP: " +
        clientIP +
        " username: " +
        req.query.user +
        " data : " +
        JSON.stringify(results).slice(0, 150)
    );
  } catch (error) {
    console.log(error);
    ioServer.emit("error_querys", "tayang monev pnbp" + error);
    res.status(500).json({
      error: error.original.sqlMessage,
    });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./public/monev_pnbp/";
    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage }).fields([
  { name: "file_surat", maxCount: 1 },
  { name: "laporan", maxCount: 1 },
  { name: "nd_kanwil", maxCount: 1 },
]);

export const updateMonevPnbp = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    const { id, no_surat, tgl_surat, ringkasan } = req.body;
    const file_surat = req.files["file_surat"]?.[0].filename;
    const laporan = req.files["laporan"]?.[0].filename;
    const tgl_upload_koord = new Date(); // Simpan tanggal dan waktu saat ini

    await MonevPnbp.update(
      { no_surat, tgl_surat, ringkasan, tgl_upload_koord, file_surat, laporan },
      { where: { id } }
    );
    res.json({ msg: "Data berhasil diperbarui" });
  });
};

export const updateLapPnbp = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    const { kdkanwil, tahun, triwulan } = req.body;
    const nd_kanwil = req.files["nd_kanwil"]?.[0].filename;
    const tgl_kirim = new Date(); // Simpan tanggal dan waktu saat ini

    try {
      const [updated] = await MonevPnbp.update(
        { nd_kanwil, tgl_kirim },
        {
          where: {
            kdkanwil,
            tahun,
            triwulan,
            no_surat: { [Sequelize.Op.ne]: null },
          },
        }
      );

      if (updated) {
        res.json({ msg: "Data berhasil diperbarui" });
      } else {
        res
          .status(404)
          .json({ error: "Data tidak ditemukan atau tidak memenuhi syarat" });
      }
    } catch (error) {
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  });
};

const getLaporan = async (req, res) => {
  try {
    // Misalnya, ambil data laporan dari database
    const laporanData = {
      id: 1,
      nama: "Laporan Kinerja",
      file: "laporan.pdf", // Hanya menyimpan nama file di database
    };

    // Kirimkan URL yang bisa diakses, bukan path lokal
    res.json({
      id: laporanData.id,
      nama: laporanData.nama,
      laporan: `http://localhost:5000/monev_pnbp/${laporanData.file}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};

Module.exports = { getLaporan };

export const getRekamanNotaDinas = async (req, res) => {
  try {
    const rekaman = await MonevPnbp.findAll();

    // Tambahkan URL lengkap untuk file
    const rekamanWithUrl = rekaman.map((data) => ({
      ...data.dataValues,
      fileUrl: data.nd_kanwil
        ? `http://localhost:5000/monev_pnbp/${data.nd_kanwil}`
        : null,
    }));

    res.json(rekamanWithUrl);
  } catch (error) {
    console.error("Error mengambil rekaman ND:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};

export const getRekaman = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT DISTINCT kdkanwil, tahun, triwulan FROM monev_pnbp WHERE nd_kanwil IS NOT NULL",
      { type: Sequelize.QueryTypes.SELECT }
    );

    res.json(result);
  } catch (error) {
    console.error("Error fetching rekaman data:", error);
    res.status(500).json({ error: "Gagal mengambil data rekaman" });
  }
};

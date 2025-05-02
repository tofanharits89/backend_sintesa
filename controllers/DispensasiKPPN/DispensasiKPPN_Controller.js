import { decryptData } from "../../middleware/Decrypt.js";
import Log_menu from "../../models/Log_menu.js";
import db from "../../config/Database3.js";
import Sequelize from "sequelize";

import moment from "moment-timezone";
import ioServer from "../../index.js";
import DispensasiKPPN_Model from "../../models/dispensasikppn/DispensasiKPPN_Model.js";
import Satker2 from "../../models/Satker2.js";
import Satker from "../../models/Satker.js";
import LampiranKPPN_Kontrak from "../../models/dispensasikppn/LampiranKPPN_Kontrak.js";

export const tayangDispensasiKPPN = async (req, res) => {
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
      nm_menu: "DISPENSASI",
    });
    ioServer.emit(
      "running_querys",
      "dispensasi, IP: " +
        clientIP +
        " username: " +
        req.query.user +
        " data : " +
        JSON.stringify(results).slice(0, 150)
    );
  } catch (error) {
    console.log(error);
    ioServer.emit("error_querys", "tayang dispensasi" + error);
    res.status(500).json({
      error: error.original.sqlMessage,
    });
  }
};

export const SimpanDispensasiKPPN = async (req, res) => {
  try {
    const {
      tanggalPermohonan,
      tahun,
      kppn,
      nomorPermohonan,
      perihal,
      alasanLainnya,
      satker,
      alasan,
      tanggalPersetujuan,
      nomorPersetujuan,
      jeniskontrak,
    } = req.body;

    // Dapatkan data Satker
    const dataSatker = await Satker.findOne({
      attributes: ["kddept", "kdunit", "kdlokasi", "kdkppn"],
      where: { kdsatker: satker, kdkppn: kppn },
    });
    // console.log(dataSatker);
    if (!dataSatker) {
      return res.status(400).json({ error: "Data Satker tidak ditemukan" });
    }

    const dataDispen = await DispensasiKPPN_Model.findOne({
      attributes: ["nopermohonan", "tgpermohonan"],
      where: {
        nopermohonan: nomorPermohonan,
        kdsatker: satker,
        kdkppn: kppn,
      },
    });

    if (dataDispen) {
      return res.status(400).json({ error: "Nomor Permohonan Sudah Ada" });
    }

    const dataSatker2 = await Satker2.findOne({
      attributes: ["kdkanwil"],
      where: { kdsatker: satker },
    });

    const newDispensasiSPM = await DispensasiKPPN_Model.create({
      thang: tahun, // Sesuaikan sesuai kebutuhan Anda
      kddept: dataSatker.kddept,
      kdunit: dataSatker.kdunit,
      kdkppn: kppn,
      jenis: jeniskontrak,
      nopermohonan: nomorPermohonan,
      halpermohonan: perihal,
      nopersetujuan: nomorPersetujuan,
      kd_dispensasi: alasan,
      kdsatker: satker,
      uraian: alasanLainnya,
      kdlokasi: dataSatker.kdlokasi,
      tgpersetujuan: moment(tanggalPersetujuan)
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD"),
      tgpermohonan: moment(tanggalPermohonan)
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD"),
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "DISPENSASI",
    });
    ioServer.emit(
      "running_querys",
      "simpan dispensasi, IP: " + clientIP + " username: " + req.query.user
    );
    return res.json({ message: "Data berhasil disimpan" });
  } catch (error) {
    ioServer.emit("error_querys", "simpan dispensasi_kontrak" + error);
    console.error("Error Menyimpan Data Dispensasi :", error);
    return res.status(500).json({ error: "Error Menyimpan Data Dispensasi" });
  }
};

export const hapusKontrakKPPN = async (req, res) => {
  // console.log(req.params);
  try {
    const query = await DispensasiKPPN_Model.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!query) return res.status(404).json({ msg: "Kontrak Not Found " });
  } catch (error) {
    console.log(error.message);
  }
  try {
    await DispensasiKPPN_Model.destroy({
      where: {
        id: req.params.id,
        kdkppn: req.params.kdkppn,
      },
    });
    await LampiranKPPN_Kontrak.destroy({
      where: {
        id_dispensasi: req.params.id,
        kdkppn: req.params.kdkppn,
      },
    });
    res.status(200).json({ msg: "Kontrak Deleted Successfuly" });
    ioServer.emit("running_querys", "hapus dispensasi kontrak kppn [sukses]");
  } catch (error) {
    console.log(error.message);
  }
};

export const SimpanLampiranKontrakKPPN = async (req, res) => {
  try {
    const { formRows, id, kdkppn } = req.body;

    // Check if Dispensasi with the given ID exists
    const dataId = await DispensasiKPPN_Model.findOne({
      where: { id: id },
    });

    if (!dataId) {
      return res.status(400).json({ error: "Data ID kontrak not found" });
    }

    for (let i = 0; i < formRows.length; i++) {
      const { nokontrak, tgkontrak, nilaikontrak, status } = formRows[i];

      // Create a Lampiran entry for each set of values
      const Lampiran_Disp = await LampiranKPPN_Kontrak.create({
        thang: "2025", // Modify as needed
        id_dispensasi: id,
        nokontrak,
        tgkontrak: moment(tgkontrak).tz("Asia/Jakarta").format("YYYY-MM-DD"),
        nilkontrak: nilaikontrak,
        status,
        kdsatker: dataId.kdsatker,
        kdkppn: kdkppn,
        tgpermohonan: moment(dataId.tgpermohonan)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD"),
        nopermohonan: dataId.nopermohonan,
      });

      try {
        const count = await LampiranKPPN_Kontrak.count({
          where: {
            id_dispensasi: id,
          },
        });
        await DispensasiKPPN_Model.update(
          { jmlkontrak: count },
          {
            where: {
              id: id,
            },
          }
        );
      } catch (error) {
        console.error("Error saat menghitung data atau memperbarui:", error);
      }
    }
    ioServer.emit("running_querys", "lampiran kontrak [status:berhasil]");
    return res.json({ message: "Data Kontrak saved successfully" });
  } catch (error) {
    console.error("Error saving Dispensasi data: ", error);
    return res.status(500).json({ error: "Error saving Dispensasi data" });
  }
};

export const hapusDetailkontrakKPPN = async (req, res) => {
  try {
    const query = await LampiranKPPN_Kontrak.findOne({
      where: {
        id: req.params.id,
        kdkppn: req.params.kdkppn,
        kdsatker: req.params.kdsatker,
        id_dispensasi: req.params.id_dispensasi,
      },
    });
    if (!query) return res.status(404).json({ msg: "Kontrak KPPN Not Found" });
  } catch (error) {
    console.log(error.message);
  }
  try {
    await LampiranKPPN_Kontrak.destroy({
      where: {
        id: req.params.id,
        kdkppn: req.params.kdkppn,
        kdsatker: req.params.kdsatker,
        id_dispensasi: req.params.id_dispensasi,
      },
    });
    res.status(200).json({ msg: "Kontrak Deleted Successfuly" });
    ioServer.emit("running_querys", "hapus kontrak");
  } catch (error) {
    console.log(error.message);
  }
  try {
    const count = await LampiranKPPN_Kontrak.count({
      where: {
        id_dispensasi: req.params.id_dispensasi,
      },
    });
    await DispensasiKPPN_Model.update(
      { jmlkontrak: count },
      {
        where: {
          id: req.params.id_dispensasi,
        },
      }
    );
  } catch (error) {
    console.error("Error saat menghitung data atau memperbarui:", error);
  }
};

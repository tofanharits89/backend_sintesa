import Dispensasi from "../models/Dispensasi.js";
import Satker from "../models/Satker.js";
import Lampiran from "../models/Lampiran_Dispensasi.js";
import { decryptData } from "../middleware/Decrypt.js";
import Log_menu from "../models/Log_menu.js";
import db from "../config/Database3.js";
import Sequelize from "sequelize";
import Kontrak from "../models/Kontrak.js";
import Tup from "../models/Tup.js";
import Satker2 from "../models/Satker2.js";
import Lampiran_Kontrak from "../models/Lampiran_Kontrak.js";
import Lampiran_Tup from "../models/Lampiran_Tup.js";
import moment from "moment-timezone";
import ioServer from "../index.js";
import fs from "fs";
import multer from "multer";
import path from "path";
import { error } from "console";
import Users from "../models/UserModel.js";

export const tayangDispensasi = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decryptData(queryParams).replace(/"/g, "");

  try {
    const resultsQuery = `${decryptedData}  LIMIT ${limit} OFFSET ${offset}`;
    const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${decryptedData}) AS totalCountSubquery`;
    console.log(resultsQuery);
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

export const tayangKontrak = async (req, res) => {
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
      nm_menu: "KONTRAK",
    });
    ioServer.emit(
      "running_querys",
      "kontrak, IP: " +
        clientIP +
        " username: " +
        req.query.user +
        " data : " +
        JSON.stringify(results).slice(0, 150)
    );
  } catch (error) {
    console.log("ini errornya" + error);
    ioServer.emit(
      "error_querys",
      "tayang dispensasi_kontrak " + error.original.sqlMessage
    );
    res.status(500).json({
      error: error.original.sqlMessage,
    });
  }
};

export const tayangTup = async (req, res) => {
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
      nm_menu: "TUP",
    });
    ioServer.emit(
      "running_querys",
      "tup, IP: " +
        clientIP +
        " username: " +
        req.query.user +
        " data : " +
        JSON.stringify(results).slice(0, 150)
    );
  } catch (error) {
    console.log("ini errornya" + error);
    ioServer.emit(
      "error_querys",
      "tayang dispensasi_tup " + error.original.sqlMessage
    );
    res.status(500).json({
      error: error.original.sqlMessage,
    });
  }
};

// Tambahkan ini di bagian awal controller untuk konfigurasi penyimpanan file dengan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // pastikan `values.jenis` dikirim dengan benar
    const jenis = req.body.jenis; // Ambil nilai 'jenis' dari request body
    if (jenis === "01") {
      cb(null, "./public/Setuju_dispen/SPM/BIASA"); // Direktori untuk jenis 01
    } else if (jenis === "03") {
      cb(null, "./public/Setuju_dispen/SPM/RPATA"); // Direktori untuk jenis 03
    } else if (jenis === "02") {
      cb(null, "./public/Setuju_dispen/Kontrak"); // Direktori untuk jenis 02
    } else if (jenis === "04") {
      cb(null, "./public/Setuju_dispen/TUP"); // Direktori untuk jenis 04
    } else {
      cb(new Error("Jenis file tidak valid"), false); // Jika jenis tidak valid
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`); // Beri nama file dengan timestamp
  },
});

const upload = multer({ storage });

export const SimpanDispensasi = (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(422).json({ msg: "Invalid File" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No File Uploaded" });
    }

    try {
      const {
        tahun,
        tanggalPermohonan,
        nomorPermohonan,
        dispen,
        satker,
        alasan,
        alasan2,
        tanggalPersetujuan,
        nomorPersetujuan,
        jenis,
      } = req.body;

      const file = req.file;
      const fileSize = file.size;
      const ext = path.extname(file.originalname);
      const fileName = file.filename;
      const url = `${req.protocol}://${req.get(
        "host"
      )}/Setuju_dispen/${fileName}`;
      const allowedType = [".pdf"];

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ error: "Invalid File" });
      }

      // Validasi ukuran file (misalnya maksimal 5MB)
      if (fileSize > 2 * 1024 * 1024) {
        return res.status(422).json({ error: "Ukuran file melebihi 2MB" });
      }

      const dataDispen = await Dispensasi.findOne({
        attributes: ["nopermohonan", "tgpermohonan"],
        where: {
          nopermohonan: nomorPermohonan,
          kdsatker: satker,
        },
      });

      if (dataDispen) {
        return res.status(400).json({ error: "Nomor Permohonan Sudah Ada" });
      }

      // Dapatkan data Satker
      const dataSatker = await Satker.findOne({
        attributes: ["kddept", "kdunit", "kdlokasi", "kdkppn"],
        where: { kdsatker: satker },
      });

      if (!dataSatker) {
        return res.status(400).json({ error: "Data Satker tidak ditemukan" });
      }

      const dataSatker2 = await Satker2.findOne({
        attributes: ["kdkanwil"],
        where: { kdsatker: satker },
      });

      const newDispensasiSPM = await Dispensasi.create({
        rpata: jenis === "03" ? "TRUE" : "FL",
        uraian: alasan2,
        thang: tahun,
        kddept: dataSatker.kddept,
        kdunit: dataSatker.kdunit,
        kdkppn: dataSatker.kdkppn,
        kdkanwil: dataSatker2.kdkanwil,
        nopermohonan: nomorPermohonan,
        nopersetujuan: nomorPersetujuan,
        kd_dispensasi: dispen,
        kdsatker: satker,
        kdlokasi: dataSatker.kdlokasi,
        tgpersetujuan: moment(tanggalPersetujuan)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD"),
        tgpermohonan: moment(tanggalPermohonan)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD"),
        file: fileName,
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
      return res
        .status(500)
        .json({ error: "Error Menyimpan Data Dispensasi" + error });
    }
  });
};

export const SimpanSPM = async (req, res) => {
  try {
    const { formRows, id, tahun } = req.body;

    // Check if Dispensasi with the given ID exists
    const dataId = await Dispensasi.findOne({
      where: { id: id, thang: tahun },
    });

    if (!dataId) {
      return res
        .status(400)
        .json({ error: "Data with the given ID not found" });
    }

    for (let i = 0; i < formRows.length; i++) {
      const { nospm, tgspm, nilaispm, nobast, tglbast, status } = formRows[i];

      // Create a Lampiran entry for each set of values
      const Lampiran_Disp = await Lampiran.create({
        thang: tahun, // Modify as needed
        id_dispensasi: id,
        nospm,
        cara_upload: "manual",
        // Use the provided value or null if it doesn't exist
        nilspm: nilaispm,
        tgspm: moment(tgspm).tz("Asia/Jakarta").format("YYYY-MM-DD"),
        tgbast: moment(tglbast).tz("Asia/Jakarta").format("YYYY-MM-DD"),
        nobast,
        status,
        kdsatker: dataId.kdsatker,
        tgpermohonan: moment(dataId.tgpermohonan)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD"),
        nopermohonan: dataId.nopermohonan,
      });

      // Add any other logic as needed
    }
    try {
      const count = await Lampiran.count({
        where: {
          id_dispensasi: id,
        },
      });
      await Dispensasi.update(
        { jmlspm: count },
        {
          where: {
            id: id,
          },
        }
      );
    } catch (error) {
      console.error("Error saat menghitung data atau memperbarui:", error);
    }
    ioServer.emit("running_querys", "simpan spm [sukses]");
    return res.json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving Dispensasi data: ", error);
    ioServer.emit("error_querys", "simpan dispensasi_spm" + error);
    return res.status(500).json({ error: "Error saving Dispensasi data" });
  }
};

export const hapusspm = async (req, res) => {
  try {
    const query = await Lampiran.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!query) return res.status(404).json({ msg: "SPM Not Found" });
  } catch (error) {
    console.log(error.message);
  }
  try {
    await Lampiran.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "SPM Deleted Successfuly" });
    ioServer.emit("running_querys", "hapus dispensasi spm [sukses]");
  } catch (error) {
    console.log(error.message);
  }
  // console.log(req.params.id, req.params.id_dispensasi);
  try {
    const count = await Lampiran.count({
      where: {
        id_dispensasi: req.params.id_dispensasi,
      },
    });
    await Dispensasi.update(
      { jmlspm: count },
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

export const dispspm = async (req, res) => {
  try {
    // Cari data dispensasi berdasarkan ID
    const query = await Dispensasi.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!query) {
      return res.status(404).json({ msg: "Dispensasi SPM Not Found" });
    }

    // Logika untuk menentukan direktori berdasarkan jenis SPM (Biasa atau RPATA)
    let baseDir = "./public/Setuju_dispen/SPM/BIASA"; // Default ke BIASA

    // Cek apakah ada tanda tertentu pada file yang menentukan jenis RPATA
    if (query.rpata === "TRUE") {
      baseDir = "./public/Setuju_dispen/SPM/RPATA"; // Jika RPATA, ganti ke RPATA
    }

    const filePath = `${baseDir}/${query.file}`;

    // Cek apakah file ada di sistem
    if (fs.existsSync(filePath)) {
      // Hapus file jika ada
      fs.unlinkSync(filePath);
    }

    // Hapus data dari database (Dispensasi dan Lampiran terkait)
    await Dispensasi.destroy({
      where: {
        id: req.params.id,
      },
    });

    await Lampiran.destroy({
      where: {
        id_dispensasi: req.params.id,
      },
    });

    // Kirimkan respons berhasil
    res.status(200).json({ msg: "Data dispensasi SPM Deleted Successfully" });

    ioServer.emit("running_querys", "hapus dispensasi SPM [status : Berhasil]");
  } catch (error) {
    console.log("Error saat menghapus dispensasi:", error.message);
    res
      .status(500)
      .json({ msg: "Terjadi kesalahan saat menghapus dispensasi" });
  }
};

export const cariSatker = async (req, res) => {
  const queryParams = req.query.queryParams;

  const decryptedData = decryptData(queryParams).replace(/"/g, "");

  try {
    const resultsQuery = `${decryptedData} `;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    res.json({
      result: results,
    });
    ioServer.emit("running_querys", "cari satker ...");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.original.sqlMessage,
    });
  }
};

export const SimpanDispensasiKontrak = (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(422).json({ msg: "Invalid File" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No File Uploaded" });
    }

    try {
      const {
        tahun,
        tanggalPermohonan,
        nomorPermohonan,
        dispen,
        satker,
        alasan2,
        tanggalPersetujuan,
        nomorPersetujuan,
      } = req.body;

      const file = req.file;
      const fileSize = file.size;
      const ext = path.extname(file.originalname);
      const fileName = file.filename;
      const url = `${req.protocol}://${req.get(
        "host"
      )}/Setuju_dispen/${fileName}`;
      const allowedType = [".pdf"];

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ error: "Invalid File" });
      }

      // Validasi ukuran file (misalnya maksimal 5MB)
      if (fileSize > 2 * 1024 * 1024) {
        return res.status(422).json({ error: "Ukuran file melebihi 2MB" });
      }

      const dataDispen = await Kontrak.findOne({
        attributes: ["nopermohonan", "tgpermohonan"],
        where: {
          nopermohonan: nomorPermohonan,
          kdsatker: satker,
        },
      });

      if (dataDispen) {
        return res.status(400).json({ error: "Nomor Permohonan Sudah Ada" });
      }

      // Dapatkan data Satker
      const dataSatker = await Satker.findOne({
        attributes: ["kddept", "kdunit", "kdlokasi", "kdkppn"],
        where: { kdsatker: satker },
      });

      if (!dataSatker) {
        return res.status(400).json({ error: "Data Satker tidak ditemukan" });
      }

      const dataSatker2 = await Satker2.findOne({
        attributes: ["kdkanwil"],
        where: { kdsatker: satker },
      });

      const newDispensasiSPM = await Kontrak.create({
        thang: tahun, // Sesuaikan sesuai kebutuhan Anda
        kddept: dataSatker.kddept,
        kdunit: dataSatker.kdunit,
        kdkppn: dataSatker.kdkppn,
        kdkanwil: dataSatker2.kdkanwil,
        nopermohonan: nomorPermohonan,
        kd_dispensasi: dispen,
        tgpersetujuan: moment(tanggalPersetujuan)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD"),
        tgpermohonan: moment(tanggalPermohonan)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD"),
        nopersetujuan: nomorPersetujuan,
        uraian: alasan2,
        kdsatker: satker,
        kdlokasi: dataSatker.kdlokasi,
        file: fileName,
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
      return res
        .status(500)
        .json({ error: "Error Menyimpan Data Dispensasi" + error });
    }
  });
};

export const SimpanLampiranKontrak = async (req, res) => {
  try {
    const { formRows, id, tahun } = req.body;

    // Check if Dispensasi with the given ID exists
    const dataId = await Kontrak.findOne({
      where: { id: id, thang: tahun },
    });

    if (!dataId) {
      return res.status(400).json({ error: "Data ID kontrak not found" });
    }

    for (let i = 0; i < formRows.length; i++) {
      const { nokontrak, tgkontrak, nilaikontrak, status } = formRows[i];

      // Create a Lampiran entry for each set of values
      const Lampiran_Disp = await Lampiran_Kontrak.create({
        thang: tahun, // Modify as needed
        id_dispensasi: id,
        nokontrak,
        cara_upload: "manual",
        // tgkontrak, // Use the provided value or null if it doesn't exist
        tgkontrak: moment(tgkontrak).tz("Asia/Jakarta").format("YYYY-MM-DD"),
        nilkontrak: nilaikontrak,
        status,
        kdsatker: dataId.kdsatker,
        tgpermohonan: moment(dataId.tgpermohonan)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD"),
        nopermohonan: dataId.nopermohonan,
      });

      // Add any other logic as needed
    }
    try {
      const count = await Lampiran_Kontrak.count({
        where: {
          id_dispensasi: id,
        },
      });
      await Kontrak.update(
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
    ioServer.emit("running_querys", "lampiran kontrak [status:berhasil]");
    return res.json({ message: "Data Kontrak saved successfully" });
  } catch (error) {
    console.error("Error saving Dispensasi data: ", error);
    return res.status(500).json({ error: "Error saving Dispensasi data" });
  }
};

export const hapuskontrak = async (req, res) => {
  try {
    const query = await Lampiran_Kontrak.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!query) return res.status(404).json({ msg: "Kontrak Not Found" });
  } catch (error) {
    console.log(error.message);
  }
  try {
    await Lampiran_Kontrak.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Kontrak Deleted Successfuly" });
    ioServer.emit("running_querys", "hapus kontrak");
  } catch (error) {
    console.log(error.message);
  }
  // console.log(req.params.id, req.params.id_dispensasi);
  try {
    const count = await Lampiran_Kontrak.count({
      where: {
        id_dispensasi: req.params.id_dispensasi,
      },
    });
    await Kontrak.update(
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

export const dispkontrak = async (req, res) => {
  try {
    // Cari data dispensasi berdasarkan ID
    const query = await Kontrak.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!query) {
      return res.status(404).json({ msg: "Dispensasi Kontrak Not Found" });
    }

    // Logika untuk menentukan direktori berdasarkan jenis SPM (Biasa atau RPATA)
    let baseDirKontrak = "./public/Setuju_dispen/Kontrak"; // Default ke BIASA

    // Cek apakah ada tanda tertentu pada file yang menentukan jenis RPATA
    // if (query.rpata === "TRUE") {
    //   baseDir = "./public/Setuju_dispen/SPM/RPATA"; // Jika RPATA, ganti ke RPATA
    // }

    const filePath = `${baseDirKontrak}/${query.file}`;

    // Cek apakah file ada di sistem
    if (fs.existsSync(filePath)) {
      // Hapus file jika ada
      fs.unlinkSync(filePath);
    }

    // Hapus data dari database (Dispensasi dan Lampiran terkait)
    await Kontrak.destroy({
      where: {
        id: req.params.id,
      },
    });

    await Lampiran_Kontrak.destroy({
      where: {
        id_dispensasi: req.params.id,
      },
    });

    // Kirimkan respons berhasil
    res
      .status(200)
      .json({ msg: "Data dispensasi Kontrak Deleted Successfully" });

    ioServer.emit(
      "running_querys",
      "hapus dispensasi Kontrak [status : Berhasil]"
    );
  } catch (error) {
    console.log("Error saat menghapus dispensasi:", error.message);
    res
      .status(500)
      .json({ msg: "Terjadi kesalahan saat menghapus dispensasi" });
  }
};

export const SimpanDispensasiTup = (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(422).json({ msg: "Invalid File" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No File Uploaded" });
    }

    try {
      const {
        tahun,
        tanggalPermohonan,
        nomorPermohonan,
        dispen,
        satker,
        alasan2,
        tanggalPersetujuan,
        nomorPersetujuan,
        username,
        kdkanwil,
      } = req.body;

      const file = req.file;
      const fileSize = file.size;
      const ext = path.extname(file.originalname);
      const fileName = file.filename;
      const url = `${req.protocol}://${req.get(
        "host"
      )}/Setuju_dispen/${fileName}`;
      const allowedType = [".pdf"];

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ error: "Invalid File" });
      }

      // Validasi ukuran file (misalnya maksimal 5MB)
      if (fileSize > 2 * 1024 * 1024) {
        return res.status(422).json({ error: "Ukuran file melebihi 2MB" });
      }

      const dataDispen = await Tup.findOne({
        attributes: ["nopermohonan", "tgpermohonan"],
        where: {
          nopermohonan: nomorPermohonan,
          kdsatker: satker,
        },
      });

      if (dataDispen) {
        return res.status(400).json({ error: "Nomor Permohonan Sudah Ada" });
      }

      // Dapatkan data Satker
      const dataSatker = await Satker.findOne({
        attributes: ["kddept", "kdunit", "kdlokasi", "kdkppn"],
        where: { kdsatker: satker },
      });

      if (!dataSatker) {
        return res.status(400).json({ error: "Data Satker tidak ditemukan" });
      }

      const dataSatker2 = await Satker2.findOne({
        attributes: ["kdkanwil"],
        where: { kdsatker: satker },
      });

      const newDispensasiSPM = await Tup.create({
        thang: tahun, // Sesuaikan sesuai kebutuhan Anda
        kddept: dataSatker.kddept,
        kdunit: dataSatker.kdunit,
        kdkppn: dataSatker.kdkppn,
        kdkanwil: dataSatker2.kdkanwil,
        nopermohonan: nomorPermohonan,
        kd_dispensasi: dispen,
        tgpersetujuan: moment(tanggalPersetujuan)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD"),
        tgpermohonan: moment(tanggalPermohonan)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD"),
        nopersetujuan: nomorPersetujuan,
        uraian: alasan2,
        kdsatker: satker,
        kdlokasi: dataSatker.kdlokasi,
        file: fileName,
        username: username,
        kdkanwil_upload: kdkanwil,
      });

      const clientIP =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;

      await Log_menu.create({
        ip: clientIP,
        username: req.query.user,
        nm_menu: "DISPENSASI_TUP",
      });

      ioServer.emit(
        "running_querys",
        "simpan dispensasi, IP: " + clientIP + " username: " + req.query.user
      );

      return res.json({ message: "Data berhasil disimpan" });
    } catch (error) {
      ioServer.emit("error_querys", "simpan dispensasi_tup" + error);
      console.error("Error Menyimpan Data Dispensasi :", error);
      return res
        .status(500)
        .json({ error: "Error Menyimpan Data Dispensasi" + error });
    }
  });
};

export const SimpanLampiranTup = async (req, res) => {
  try {
    const { formRows, id, tahun } = req.body;

    // Check if Dispensasi with the given ID exists
    const dataId = await Tup.findOne({
      where: { id: id, thang: tahun },
    });

    if (!dataId) {
      return res.status(400).json({ error: "Data ID TUP not found" });
    }

    for (let i = 0; i < formRows.length; i++) {
      const { notup, tgtup, nilaitup, status } = formRows[i];

      // Create a Lampiran entry for each set of values
      const Lampiran_Disp = await Lampiran_Tup.create({
        thang: tahun, // Modify as needed
        id_dispensasi: id,
        notup,
        cara_upload: "manual",
        // tgkontrak, // Use the provided value or null if it doesn't exist
        tgtup: moment(tgtup).tz("Asia/Jakarta").format("YYYY-MM-DD"),
        niltup: nilaitup,
        status,
        kdsatker: dataId.kdsatker,
        tgpermohonan: moment(dataId.tgpermohonan)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD"),
        nopermohonan: dataId.nopermohonan,
      });

      // Add any other logic as needed
    }
    try {
      const count = await Lampiran_Tup.count({
        where: {
          id_dispensasi: id,
        },
      });
      await Tup.update(
        { jmltup: count },
        {
          where: {
            id: id,
          },
        }
      );
    } catch (error) {
      console.error("Error saat menghitung data atau memperbarui:", error);
    }
    ioServer.emit("running_querys", "lampiran tup [status:berhasil]");
    return res.json({ message: "Data TUP saved successfully" });
  } catch (error) {
    console.error("Error saving Dispensasi data: ", error);
    return res.status(500).json({ error: "Error saving Dispensasi data" });
  }
};

export const hapustup = async (req, res) => {
  try {
    const query = await Lampiran_Tup.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!query) return res.status(404).json({ msg: "TUP Not Found" });
  } catch (error) {
    console.log(error.message);
  }
  try {
    await Lampiran_Tup.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "TUP Deleted Successfuly" });
    ioServer.emit("running_querys", "hapus tup");
  } catch (error) {
    console.log(error.message);
  }
  // console.log(req.params.id, req.params.id_dispensasi);
  try {
    const count = await Lampiran_Tup.count({
      where: {
        id_dispensasi: req.params.id_dispensasi,
      },
    });
    await Tup.update(
      { jmltup: count },
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

export const disptup = async (req, res) => {
  try {
    // Cari data dispensasi berdasarkan ID
    const query = await Tup.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!query) {
      return res.status(404).json({ msg: "Dispensasi TUP Not Found" });
    }

    // Logika untuk menentukan direktori berdasarkan jenis SPM (Biasa atau RPATA)
    let baseDirTup = "./public/Setuju_dispen/TUP"; // Default ke BIASA

    // Cek apakah ada tanda tertentu pada file yang menentukan jenis RPATA
    // if (query.rpata === "TRUE") {
    //   baseDir = "./public/Setuju_dispen/SPM/RPATA"; // Jika RPATA, ganti ke RPATA
    // }

    const filePath = `${baseDirTup}/${query.file}`;

    // Cek apakah file ada di sistem
    if (fs.existsSync(filePath)) {
      // Hapus file jika ada
      fs.unlinkSync(filePath);
    }

    // Hapus data dari database (Dispensasi dan Lampiran terkait)
    await Tup.destroy({
      where: {
        id: req.params.id,
      },
    });

    await Lampiran_Tup.destroy({
      where: {
        id_dispensasi: req.params.id,
      },
    });

    // Kirimkan respons berhasil
    res.status(200).json({ msg: "Data dispensasi TUP Deleted Successfully" });

    ioServer.emit("running_querys", "hapus dispensasi TUP [status : Berhasil]");
  } catch (error) {
    console.log("Error saat menghapus dispensasi:", error.message);
    res
      .status(500)
      .json({ msg: "Terjadi kesalahan saat menghapus dispensasi" });
  }
};

export const SimpanUploadSPM = async (req, res) => {
  try {
    const { data, ...formData } = req.body;
    // console.log(req.body);
    // Loop untuk menyimpan setiap data dalam array data ke tabel Lampiran_Kontrak
    for (const item of data) {
      await Lampiran.create({
        thang: formData[0].thang,
        kddept: formData[0].kddept,
        kdunit: formData[0].kdunit,
        kdkanwil: formData[0].kdkanwil,
        kdlokasi: formData[0].kdlokasi,
        kdsatker: formData[0].kdsatker,
        tgpermohonan: formData[0].tgpermohonan,
        nopermohonan: formData[0].nopermohonan,
        kd_dispensasi: formData[0].kd_dispensasi,
        rpata: formData[0].rpata,
        id_dispensasi: formData[0].id,
        tgspm: item.tgspm,
        nospm: item.nospm,
        nilspm: item.nilai_spm,
        tgbast: item.tgbast,
        nobast: item.nobast,
        status: "Setuju",
        cara_upload: "auto",
      });
    }
    try {
      const count = await Lampiran.count({
        where: {
          id_dispensasi: formData[0].id,
        },
      });
      await Dispensasi.update(
        { jmlspm: count },
        {
          where: {
            id: formData[0].id,
          },
        }
      );
    } catch (error) {
      console.error("Error saat menghitung data atau memperbarui:", error);
    }
    // Emit event menggunakan socket.io
    ioServer.emit("running_querys", "lampiran kontrak [status:berhasil]");
    return res.json({ message: "Data Kontrak saved successfully" });
  } catch (error) {
    console.error("Error saving Dispensasi data: ", error);
    return res.status(500).json({ error: "Error saving Dispensasi data" });
  }
};

export const SimpanUploadKontrak = async (req, res) => {
  try {
    const { data, ...formData } = req.body;
    // console.log(req.body);
    // Loop untuk menyimpan setiap data dalam array data ke tabel Lampiran_Kontrak
    for (const item of data) {
      await Lampiran_Kontrak.create({
        thang: formData[0].thang,
        kddept: formData[0].kddept,
        kdunit: formData[0].kdunit,
        kdkanwil: formData[0].kdkanwil,
        kdlokasi: formData[0].kdlokasi,
        kdsatker: formData[0].kdsatker,
        tgpermohonan: formData[0].tgpermohonan,
        nopermohonan: formData[0].nopermohonan,
        kd_dispensasi: formData[0].kd_dispensasi,

        id_dispensasi: formData[0].id,
        tgkontrak: item.tgkontrak,
        nilkontrak: item.nilkontrak,
        nokontrak: item.nokontrak,

        status: "Setuju",
        cara_upload: "auto",
      });
    }
    try {
      const count = await Lampiran_Kontrak.count({
        where: {
          id_dispensasi: formData[0].id,
        },
      });
      await Kontrak.update(
        { jmlkontrak: count },
        {
          where: {
            id: formData[0].id,
          },
        }
      );
    } catch (error) {
      console.error("Error saat menghitung data atau memperbarui:", error);
    }
    // Emit event menggunakan socket.io
    ioServer.emit("running_querys", "lampiran kontrak [status:berhasil]");
    return res.json({ message: "Data Kontrak saved successfully" });
  } catch (error) {
    console.error("Error saving Dispensasi data: ", error);
    return res.status(500).json({ error: "Error saving Dispensasi data" });
  }
};
// console.log(Dispensasi);

export const SimpanUploadTup = async (req, res) => {
  try {
    const { data, ...formData } = req.body;
    // console.log(req.body);
    // Loop untuk menyimpan setiap data dalam array data ke tabel Lampiran_Tup
    for (const item of data) {
      await Lampiran_Tup.create({
        thang: formData[0].thang,
        kddept: formData[0].kddept,
        kdunit: formData[0].kdunit,
        kdkanwil: formData[0].kdkanwil,
        kdlokasi: formData[0].kdlokasi,
        kdsatker: formData[0].kdsatker,
        tgpermohonan: formData[0].tgpermohonan,
        nopermohonan: formData[0].nopermohonan,
        kd_dispensasi: formData[0].kd_dispensasi,
        id_dispensasi: formData[0].id,
        tgtup: item.tgtup,
        niltup: item.niltup,
        notup: item.notup,

        status: "Setuju",
        cara_upload: "auto",
      });
    }
    try {
      const count = await Lampiran_Tup.count({
        where: {
          id_dispensasi: formData[0].id,
        },
      });
      await Tup.update(
        { jmltup: count },
        {
          where: {
            id: formData[0].id,
          },
        }
      );
    } catch (error) {
      console.error("Error saat menghitung data atau memperbarui:", error);
    }
    // Emit event menggunakan socket.io
    ioServer.emit("running_querys", "lampiran TUP [status:berhasil]");
    return res.json({ message: "Data TUP saved successfully" });
  } catch (error) {
    console.error("Error saving Dispensasi data: ", error);
    return res.status(500).json({ error: "Error saving Dispensasi data" });
  }
};

export const downloadFileDispen = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Konversi ke integer
    // console.log(`Type of ID received: ${typeof id}, Value: ${id}`);

    const dispenData = await Dispensasi.findByPk(id);

    if (!dispenData) {
      // console.log("Data not found for ID:", id);
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }

    const jenis = dispenData.rpata === "TRUE" ? "03" : "01"; // Assume jenis is based on rpata field
    let basePath = "";

    // Tentukan direktori berdasarkan jenis
    if (jenis === "01") {
      basePath = path.join("public", "Setuju_dispen", "SPM", "BIASA");
    } else if (jenis === "03") {
      basePath = path.join("public", "Setuju_dispen", "SPM", "RPATA");
    }
    // else if (jenis === "02") {
    //   basePath = path.join("public", "Setuju_dispen", "Kontrak");
    // }
    else {
      // console.log("Invalid jenis:", jenis);
      return res.status(400).json({ msg: "Jenis file tidak valid" });
    }

    // Build the full file path
    const filePath = path.join(basePath, dispenData.file);
    // console.log(`Checking file path: ${filePath}`);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      // console.log("File not found at path:", filePath);
      return res.status(404).json({ msg: "File tidak ditemukan" });
    }

    const fileName = path.basename(filePath); // Get the correct file name from filePath
    const data = fs.readFileSync(filePath);

    // Atur Content-Type berdasarkan ekstensi file
    let contentType = "application/pdf"; // Default content type
    const fileExt = path.extname(fileName).toLowerCase();
    switch (fileExt) {
      case ".pdf":
        contentType = "application/pdf";
        break;
      default:
        contentType = "application/octet-stream"; // Fallback for unknown types
        break;
    }

    res.set({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    });
    res.send(data);

    console.log("File sent successfully");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ msg: "Terjadi kesalahan" });
  }
};

export const downloadFileDispenKontrak = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Konversi ke integer
    // console.log(`Type of ID received: ${typeof id}, Value: ${id}`);

    const dispenKontrakData = await Kontrak.findByPk(id);

    if (!dispenKontrakData) {
      // console.log("Data not found for ID:", id);
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }

    const filePath = path.resolve(
      "public",
      "Setuju_dispen",
      "Kontrak",
      dispenKontrakData.file
    );

    // Log the file path being checked
    // console.log(`Checking file path: ${filePath}`);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      // console.log("File not found at path:", filePath);
      return res.status(404).json({ msg: "File tidak ditemukan" });
    }

    const fileName = path.basename(filePath); // Get the correct file name from filePath
    const data = fs.readFileSync(filePath);

    // Atur Content-Type berdasarkan ekstensi file
    let contentType = "application/pdf"; // Default content type
    const fileExt = path.extname(fileName).toLowerCase();
    switch (fileExt) {
      case ".pdf":
        contentType = "application/pdf";
        break;
      default:
        contentType = "application/octet-stream"; // Fallback for unknown types
        break;
    }

    res.set({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    });
    res.send(data);

    console.log("File sent successfully");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ msg: "Terjadi kesalahan" });
  }
};

export const downloadFileDispenTup = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Konversi ke integer
    // console.log(`Type of ID received: ${typeof id}, Value: ${id}`);

    const dispenTupData = await Tup.findByPk(id);

    if (!dispenTupData) {
      // console.log("Data not found for ID:", id);
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }

    const filePath = path.resolve(
      "public",
      "Setuju_dispen",
      "TUP",
      dispenTupData.file
    );

    // Log the file path being checked
    // console.log(`Checking file path: ${filePath}`);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      // console.log("File not found at path:", filePath);
      return res.status(404).json({ msg: "File tidak ditemukan" });
    }

    const fileName = path.basename(filePath); // Get the correct file name from filePath
    const data = fs.readFileSync(filePath);

    // Atur Content-Type berdasarkan ekstensi file
    let contentType = "application/pdf"; // Default content type
    const fileExt = path.extname(fileName).toLowerCase();
    switch (fileExt) {
      case ".pdf":
        contentType = "application/pdf";
        break;
      default:
        contentType = "application/octet-stream"; // Fallback for unknown types
        break;
    }

    res.set({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    });
    res.send(data);

    console.log("File sent successfully");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ msg: "Terjadi kesalahan" });
  }
};

export const tayangMonitoring = async (req, res) => {
  const queryParams = req.query.queryParams; // Query terenkripsi dari frontend
  const limit = parseInt(req.query.limit) || 25;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  // Mendekripsi query
  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    // Query untuk mendapatkan data paginasi
    const resultsQuery = `
    SELECT a.kddept, c.nmdept, a.tgpersetujuan, 
           COUNT(a.jmlspm) AS jumlah_spm, SUM(b.nilspm) AS nilai_spm
    FROM laporan_2023.dispensasi_spm a
    LEFT JOIN laporan_2023.dispensasi_spm_lampiran b ON a.id = b.id_dispensasi
    LEFT JOIN dbref.t_dept_2024 c ON a.kddept = c.kddept
    ${decryptedData ? `WHERE ${decryptedData}` : ""}
    GROUP BY a.kddept, a.tgpersetujuan
    ORDER BY a.kddept DESC
    LIMIT :limit OFFSET :offset
`;
    // console.log(resultsQuery);
    // Query untuk mendapatkan total jumlah SPM dan nilai SPM
    const totalCountQuery = `
    SELECT COUNT(*) AS totalCount, COUNT(a.jmlspm) AS totalSPM, SUM(b.nilspm) AS totalNilaiSPM
    FROM laporan_2023.dispensasi_spm a
    LEFT JOIN laporan_2023.dispensasi_spm_lampiran b ON a.id = b.id_dispensasi
    ${decryptedData ? `WHERE ${decryptedData}` : ""}
`;
// console.log(resultsQuery,totalCountQuery);

    // Menjalankan kedua query secara paralel
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

    const totalCount = totalCountResult[0].totalCount || 0;
    const totalSPM = totalCountResult[0].totalSPM || 0;
    const totalNilaiSPM = totalCountResult[0].totalNilaiSPM || 0;

    // Mengembalikan hasil ke frontend
    res.json({
      result: results, // Data per halaman (sesuai paginasi)
      page: page, // Halaman yang sedang ditampilkan
      limit: limit, // Limit per halaman
      totalPages: Math.ceil(totalCount / limit), // Total halaman
      totalRows: totalCount, // Total jumlah baris
      totalSPM: totalSPM, // Total jumlah SPM
      totalNilaiSPM: totalNilaiSPM, // Total nilai SPM
    });

    // Logging user yang melakukan query
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "MONITORING_DISPENSASI",
    });
  } catch (error) {
    // Handling error
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

import Sequelize, { Op } from "sequelize";
import { decryptData } from "../../middleware/Decrypt.js";
import db from "../../config/DatabaseTkd.js";
import Log_menu from "../../models/Log_menu.js";
import Ref_kmk_Dau_Model from "../../models/tkd/Ref_kmk_Dau_Model.js";
import multer from "multer";
import path from "path";
import Ref_kmk_Cabut_Model from "../../models/tkd/Ref_kmk_cabut.js";
import moment from "moment-timezone";
import Ref_kmk_Detail_Model from "../../models/tkd/Ref_kmk_Detail_Model.js";
import Ref_kmk_Penundaan_Model from "../../models/tkd/Ref_kmk_Dau_Penundaan.js";
import CryptoJS from "crypto-js";
import Ref_Penundaan from "../../models/tkd/Ref_Penundaan.js";
import Ref_kmk_Alokasi_bulanan_List from "../../models/tkd/Ref_kmk_alokasi_bulanan_list.js";
import Ref_kmk_pencabutan from "../../models/tkd/Ref_kmk_pencabutan.js";
import Ref_pencabutan from "../../models/tkd/Ref_pencabutan.js";
import Rekap from "../../models/tkd/Ref_kmk_Rekap.js";

import Data_beda from "../../models/data_omspan/data_beda.js";
import Rekon_potongan from "../../models/data_omspan/rekon_potongan.js";
import Rekon_penundaan from "../../models/data_omspan/rekon_penundaan.js";
import Rekap25 from "../../models/tkd/Ref_kmk_Rekap25.js";
import Ref_kmk_Detail_Model25 from "../../models/tkd/Ref_kmk_Detail_Model25.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/KMK"); // Tentukan direktori penyimpanan file
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`); // Beri nama file dengan timestamp
  },
});

const upload = multer({ storage });

export const Dau_KMK = async (req, res) => {
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
      nm_menu: "DAU_KMK",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.original.sqlMessage,
    });
  }
};

export const Ref_Dau = async (req, res) => {
  const queryParams = req.query.queryParams;

  const decryptedData = decryptData(queryParams).replace(/"/g, "");

  try {
    const resultsQuery = `${decryptedData} `;

    const [results] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    res.json({
      result: results,
    });
  } catch (error) {
    console.error("Error in processing query:", error);
    const errorMessage = error.original
      ? error.original.sqlMessage
      : "Terjadi kesalahan dalam memproses permintaan.";
    res.status(500).json({ error: errorMessage });
  }
};

export const SimpanKMK = async (req, res) => {
  const { jenis } = req.body;

  if (jenis !== "3") {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(422).json({ msg: "Invalid PDF" });
      }

      if (req.file === null) {
        return res.status(400).json({ msg: "No File Uploaded" });
      }

      // Check if req.file is defined before accessing its properties
      if (req.file && req.file.size) {
        const { kriteria, nomorkmk1, tglkmk1, uraian1, jenis } = req.body;
        const fileSize = req.file.size;
        const ext = path.extname(req.file.originalname);
        const fileName = req.file.filename;
        const url = `${req.protocol}://${req.get("host")}/KMK/${fileName}`;
        const allowedType = [".pdf"];

        if (!allowedType.includes(ext.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid PDF" });
        }
        if (fileSize > 10000000) {
          return res.status(422).json({ msg: "File must be less than 10 MB" });
        }

        try {
          await Ref_kmk_Dau_Model.create({
            thang: "2024",
            no_kmk: nomorkmk1,
            tgl_kmk: moment(tglkmk1).format("YYYY-MM-DD"),
            jenis: jenis,
            kriteria: kriteria,
            uraian: uraian1,
            filekmk: url,
          });
          res.status(201).json({ msg: "KMK Berhasil Disimpan" });
        } catch (error) {
          console.log(error.message);
          res.status(500).json({ msg: "Internal Server Error tes" });
        }
      } else {
        return res.status(400).json({ msg: "File is missing or invalid" });
      }
    });
  } else {
    // Handle the case when jenis is "3"
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const SimpanKMKJENIS3 = async (req, res) => {
  const {
    tunda,
    kppn,
    kdpemda,
    jenis,
    kriteria,
    cabut,
    kmkcabut,
    tgcabut,
    uraiancabut,
  } = req.body;

  const CekData = await Ref_kmk_Dau_Model.findAll({
    attributes: ["no_kmk", "kdkppn", "kdpemda", "jenis", "kriteria"],
    where: {
      no_kmk: tunda,
      kdkppn: kppn,
      kdpemda: kdpemda,
      jenis: jenis,
      kriteria: kriteria,
    },
  });

  if (CekData.length > 0) {
    return res.status(400).json({ error: "Data Sudah Ada" });
  } else {
    const CekDataLagi = await Ref_kmk_Dau_Model.findAll({
      attributes: ["tgl_kmk"],
      where: {
        no_kmk: tunda,
      },
    });

    if (CekDataLagi[0].tgl_kmk > cabut) {
      res.status(401).json({ msg: "Tanggal Penundaan harus lebih besar" });
    } else {
      try {
        const CekDataLagidanLagi = await Ref_kmk_Dau_Model.findAll({
          attributes: ["tgl_kmk", "uraian", "thang"],
          where: {
            no_kmk: tunda,
          },
        });
        await Ref_kmk_Dau_Model.create({
          thang: "2023",
          no_kmk: tunda,
          tgl_kmk: CekDataLagidanLagi[0].tgl_kmk,
          jenis: jenis,
          kriteria: kriteria,
          uraian: CekDataLagidanLagi[0].uraian,
          thangcabut: cabut,
          no_kmkcabut: kmkcabut,
          tglcabut: moment(tgcabut).format("YYYY-MM-DD"),
          uraiancabut: uraiancabut,
          status_cabut: "1",
          kdkppn: kppn,
          kdpemda: kdpemda,
        });
        res.status(201).json({ msg: "KMK Berhasil Disimpan" });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
      }
    }
  }
};

export const SimpanKMKCabut = async (req, res) => {
  const { tunda, thang, nomorkmk1, tglkmk1, uraian1 } = req.body;
  const CekData = await Ref_kmk_Cabut_Model.findAll({
    attributes: ["kmktunda"],
    where: {
      thangcabut: thang,
      no_kmkcabut: nomorkmk1,
      tglcabut: moment(tglkmk1).tz("Asia/Jakarta").format("YYYY-MM-DD"),
    },
  });

  if (CekData.length > 0) {
    return res.status(400).json({ error: "Data Sudah Ada" });
  } else {
    try {
      await Ref_kmk_Cabut_Model.create({
        kmktunda: tunda,
        thangcabut: thang,
        no_kmkcabut: nomorkmk1,
        tglcabut: moment(tglkmk1).format("YYYY-MM-DD"),
        uraiancabut: uraian1,
      });
      res.status(201).json({ msg: "KMK Pencabutan Berhasil Disimpan" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  }
};

export const hapuspotongan = async (req, res) => {
  try {
    const query = await Ref_kmk_Detail_Model.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!query) return res.status(404).json({ msg: "Data Potongan Not Found" });
  } catch (error) {
    console.log(error.message);
  }
  try {
    await Ref_kmk_Detail_Model.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Data Potongan Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const hapuskmk = async (req, res) => {
  try {
    const query = await Ref_kmk_Dau_Model.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!query) return res.status(404).json({ msg: "Data KMK Not Found" });
  } catch (error) {
    console.log(error.message);
  }
  try {
    await Ref_kmk_Dau_Model.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Data KMK Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const hapuspenundaan = async (req, res) => {
  try {
    const query = await Ref_kmk_Penundaan_Model.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!query)
      return res.status(404).json({ msg: "Data Penundaan Not Found" });
  } catch (error) {
    console.log(error.message);
  }
  try {
    await Ref_kmk_Penundaan_Model.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Data Penundaan Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const SimpanPenundaan = async (req, res) => {
  const {
    thang,
    jenis,
    nokmk,
    kriteria,
    kdpemda,
    kppn,
    jan1,
    peb1,
    mar1,
    apr1,
    mei1,
    jun1,
    jul1,
    ags1,
    sep1,
    okt1,
    nov1,
    des1,
    alokasi,
    uraian,
  } = req.body;

  // if (
  //   parseInt(jan1) > parseInt((alokasi * 25) / 100) ||
  //   parseInt(peb1) > parseInt((alokasi * 25) / 100) ||
  //   parseInt(mar1) > parseInt((alokasi * 25) / 100) ||
  //   parseInt(apr1) > parseInt((alokasi * 25) / 100) ||
  //   parseInt(mei1) > parseInt((alokasi * 25) / 100) ||
  //   parseInt(jun1) > parseInt((alokasi * 25) / 100) ||
  //   parseInt(jul1) > parseInt((alokasi * 25) / 100) ||
  //   parseInt(ags1) > parseInt((alokasi * 25) / 100) ||
  //   parseInt(sep1) > parseInt((alokasi * 25) / 100) ||
  //   parseInt(okt1) > parseInt((alokasi * 25) / 100) ||
  //   parseInt(nov1) > parseInt((alokasi * 25) / 100) ||
  //   parseInt(des1) > parseInt((alokasi * 25) / 100)
  // ) {
  //   return res.status(400).json({
  //     error: `Data Alokasi Bulanan (${parseInt(
  //       alokasi
  //     )}) melebihi data Alokasi bulanan ${(alokasi * 25) / 100}`,
  //   });
  // }

  // cek data penundaan
  const CekData = await Ref_kmk_Penundaan_Model.findAll({
    attributes: ["no_kmk"],
    where: {
      thang: thang,
      jenis: jenis,
      no_kmk: nokmk,
      kriteria: kriteria,
      kdkppn: kppn,
      kdpemda: kdpemda,
    },
  });

  if (CekData.length > 0) {
    return res.status(400).json({
      error: `Data Penundaan KMK Nomor ${nokmk}, KPPN ${kppn} dan Pemda ${kdpemda} Sudah Ada`,
    });
  }

  try {
    const currentDate = new Date();

    await Ref_kmk_Penundaan_Model.create({
      thang,
      no_kmk: nokmk,
      jenis,
      kriteria,
      uraian,
      kdkppn: kppn,
      kdpemda,
      jan: jan1,
      peb: peb1,
      mar: mar1,
      apr: apr1,
      mei: mei1,
      jun: jun1,
      jul: jul1,
      ags: ags1,
      sep: sep1,
      okt: okt1,
      nov: nov1,
      des: des1,
      alias: CryptoJS.MD5(nokmk).toString(),
      update_data: currentDate.toISOString().slice(0, 19).replace("T", " "),
      status_cabut: "0",
    });

    //hapus data terlebih dahulu
    await Ref_Penundaan.destroy({
      where: {
        kdpemda: kdpemda,
        kdkppn: kppn,
        jenis: jenis,
        kriteria: kriteria,
        kmk_tunda: nokmk,
      },
    });

    const dataToInsert = [
      { bulan: "01", uang: jan1 },
      { bulan: "02", uang: peb1 },
      { bulan: "03", uang: mar1 },
      { bulan: "04", uang: apr1 },
      { bulan: "05", uang: mei1 },
      { bulan: "06", uang: jun1 },
      { bulan: "07", uang: jul1 },
      { bulan: "08", uang: ags1 },
      { bulan: "09", uang: sep1 },
      { bulan: 10, uang: okt1 },
      { bulan: 11, uang: nov1 },
      { bulan: 12, uang: des1 },
    ];

    await Promise.all(
      dataToInsert.map(async (data) => {
        await Ref_Penundaan.create({
          thang: thang,
          jenis: jenis,
          kriteria: kriteria,
          kmk_tunda: nokmk,
          kdpemda: kdpemda,
          kdkppn: kppn,
          waktu: currentDate.toISOString().slice(0, 19).replace("T", " "),
          alias: CryptoJS.MD5(nokmk).toString(),
          ...data,
        });
      })
    );

    // Hapus data dengan bulan kosong atau nilai uang 0
    await Ref_Penundaan.destroy({
      where: {
        [Op.or]: [{ bulan: "" }, { uang: 0 }],
      },
    });
    res.status(201).json({ msg: "Data berhasil disimpan" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Gagal menyimpan data Penundaan" });
  }
};

export const SimpanPencabutan = async (req, res) => {
  const {
    kdpemda,
    kppn,
    bulan,
    potong,
    akun,
    nilai,
    thang,
    jenis,
    kriteria,
    kdsatker,
    kdlokasi,
    JAN,
    PEB,
    MAR,
    APR,
    MEI,
    JUN,
    JUL,
    AGS,
    SEP,
    OKT,
    NOV,
    DES,
    NO_KMK,
    KMK_CABUT,
    BULANCABUT,
  } = req.body;

  if (jenis === "1") {
    // cek data
    const CekData = await Ref_kmk_Detail_Model.findAll({
      attributes: ["no_kmk"],
      where: {
        bulan: bulan,
        kdkppn: kppn,
        kdkabkota: kdpemda,
        kdakun: akun,
        jenis_kmk: "1",
      },
    });

    if (CekData.length > 0) {
      return res.status(400).json({
        error: `Data Sudah Pernah Disimpan`,
      });
    }

    // cek data
    const CekJumlahAlokasi = await Ref_kmk_Alokasi_bulanan_List.findOne({
      attributes: ["alokasi", "bulan"],
      where: {
        bulan: bulan,
        kdpemda: kdpemda,
        kdkppn: kppn,
      },
    });

    if (CekJumlahAlokasi) {
      if (nilai > CekJumlahAlokasi.alokasi) {
        return res.status(400).json({
          error: `Nilai Potongan Melebihi Alokasi Bulanan`,
        });
      }
    } else {
      return res.status(400).json({
        error: `Error saat cek alokasi dan nilai input [CekJumlahAlokasi.alokasi tidak terbaca]`,
      });
    }

    const bulanMap = {
      "01": "JANUARI",
      "02": "PEBRUARI",
      "03": "MARET",
      "04": "APRIL",
      "05": "MEI",
      "06": "JUNI",
      "07": "JULI",
      "08": "AGUSTUS",
      "09": "SEPTEMBER",
      10: "OKTOBER",
      11: "NOVEMBER",
      12: "DESEMBER",
    };

    const currentDate = new Date();
    await Ref_kmk_Detail_Model.create({
      nmbulan: bulanMap[bulan],
      kdkppn: kppn,
      kdkabkota: kdpemda,
      kdakun: akun,
      kdsatker: kdsatker,
      kdlokasi: kdlokasi,
      nilai: nilai,
      thang: thang,
      no_kmk: potong,
      jenis_kmk: jenis,
      kriteria: kriteria,
      update_data: currentDate,
      bulan: bulan,
    });
    res.status(200).json({ msg: "Data Potongan Berhasil Disimpan" });
  }

  if (jenis === "3") {
    const CekData = await Ref_kmk_pencabutan.findAll({
      attributes: ["kmk_tunda"],
      where: {
        kmk_tunda: NO_KMK,
        kriteria: kriteria,
        kdkppn: kppn,
        kdpemda: kdpemda,
      },
    });

    if (CekData.length > 0) {
      return res.status(400).json({
        error: `Data KMK ini sudah pernah dilakukan pencabutan`,
      });
    }

    //hapus data terlebih dahulu
    await Ref_pencabutan.destroy({
      where: {
        kdpemda: kdpemda,
        kdkppn: kppn,
        jenis: jenis,
        kriteria: kriteria,
        kmk_tunda: potong,
      },
    });

    const currentDate = new Date();
    const formattedBulan = BULANCABUT.toString().padStart(2, "0");
    const januari = JAN > 0 && {
      thang: thang,
      jenis: jenis,
      kriteria: kriteria,
      kmk_tunda: NO_KMK,
      kmk_cabut: KMK_CABUT,
      alias: CryptoJS.MD5(NO_KMK).toString(),
      waktu: currentDate.toISOString().slice(0, 19).replace("T", " "),
      bulan: formattedBulan,
      uang: JAN,
      kdpemda: kdpemda,
      kdkppn: kppn,
    };

    const pebruari = PEB > 0 && {
      thang: thang,
      jenis: jenis,
      kriteria: kriteria,
      kmk_tunda: NO_KMK,
      kmk_cabut: KMK_CABUT,
      alias: CryptoJS.MD5(NO_KMK).toString(),
      waktu: currentDate.toISOString().slice(0, 19).replace("T", " "),
      bulan: formattedBulan,
      uang: PEB,
      kdpemda: kdpemda,
      kdkppn: kppn,
    };

    const maret = MAR > 0 && {
      thang: thang,
      jenis: jenis,
      kriteria: kriteria,
      kmk_tunda: NO_KMK,
      kmk_cabut: KMK_CABUT,
      alias: CryptoJS.MD5(NO_KMK).toString(),
      waktu: currentDate.toISOString().slice(0, 19).replace("T", " "),
      bulan: formattedBulan,
      uang: MAR,
      kdpemda: kdpemda,
      kdkppn: kppn,
    };

    const april = APR > 0 && {
      thang: thang,
      jenis: jenis,
      kriteria: kriteria,
      kmk_tunda: NO_KMK,
      kmk_cabut: KMK_CABUT,
      alias: CryptoJS.MD5(NO_KMK).toString(),
      waktu: currentDate.toISOString().slice(0, 19).replace("T", " "),
      bulan: formattedBulan,
      uang: APR,
      kdpemda: kdpemda,
      kdkppn: kppn,
    };

    const mei = MEI > 0 && {
      thang: thang,
      jenis: jenis,
      kriteria: kriteria,
      kmk_tunda: NO_KMK,
      kmk_cabut: KMK_CABUT,
      alias: CryptoJS.MD5(NO_KMK).toString(),
      waktu: currentDate.toISOString().slice(0, 19).replace("T", " "),
      bulan: formattedBulan,
      uang: MEI,
      kdpemda: kdpemda,
      kdkppn: kppn,
    };

    const juni = JUN > 0 && {
      thang: thang,
      jenis: jenis,
      kriteria: kriteria,
      kmk_tunda: NO_KMK,
      kmk_cabut: KMK_CABUT,
      alias: CryptoJS.MD5(NO_KMK).toString(),
      waktu: currentDate.toISOString().slice(0, 19).replace("T", " "),
      bulan: formattedBulan,
      uang: JUN,
      kdpemda: kdpemda,
      kdkppn: kppn,
    };

    const juli = JUL > 0 && {
      thang: thang,
      jenis: jenis,
      kriteria: kriteria,
      kmk_tunda: NO_KMK,
      kmk_cabut: KMK_CABUT,
      alias: CryptoJS.MD5(NO_KMK).toString(),
      waktu: currentDate.toISOString().slice(0, 19).replace("T", " "),
      bulan: formattedBulan,
      uang: JUL,
      kdpemda: kdpemda,
      kdkppn: kppn,
    };

    const agustus = AGS > 0 && {
      thang: thang,
      jenis: jenis,
      kriteria: kriteria,
      kmk_tunda: NO_KMK,
      kmk_cabut: KMK_CABUT,
      alias: CryptoJS.MD5(NO_KMK).toString(),
      waktu: currentDate.toISOString().slice(0, 19).replace("T", " "),
      bulan: formattedBulan,
      uang: AGS,
      kdpemda: kdpemda,
      kdkppn: kppn,
    };

    const september = SEP > 0 && {
      thang: thang,
      jenis: jenis,
      kriteria: kriteria,
      kmk_tunda: NO_KMK,
      kmk_cabut: KMK_CABUT,
      alias: CryptoJS.MD5(NO_KMK).toString(),
      waktu: currentDate.toISOString().slice(0, 19).replace("T", " "),
      bulan: formattedBulan,
      uang: SEP,
      kdpemda: kdpemda,
      kdkppn: kppn,
    };

    const oktober = OKT > 0 && {
      thang: thang,
      jenis: jenis,
      kriteria: kriteria,
      kmk_tunda: NO_KMK,
      kmk_cabut: KMK_CABUT,
      alias: CryptoJS.MD5(NO_KMK).toString(),
      waktu: currentDate.toISOString().slice(0, 19).replace("T", " "),
      bulan: formattedBulan,
      uang: OKT,
      kdpemda: kdpemda,
      kdkppn: kppn,
    };

    const november = NOV > 0 && {
      thang: thang,
      jenis: jenis,
      kriteria: kriteria,
      kmk_tunda: NO_KMK,
      kmk_cabut: KMK_CABUT,
      alias: CryptoJS.MD5(NO_KMK).toString(),
      waktu: currentDate.toISOString().slice(0, 19).replace("T", " "),
      bulan: formattedBulan,
      uang: NOV,
      kdpemda: kdpemda,
      kdkppn: kppn,
    };

    const desember = DES > 0 && {
      thang: thang,
      jenis: jenis,
      kriteria: kriteria,
      kmk_tunda: NO_KMK,
      kmk_cabut: KMK_CABUT,
      alias: CryptoJS.MD5(NO_KMK).toString(),
      waktu: currentDate.toISOString().slice(0, 19).replace("T", " "),
      bulan: formattedBulan,
      uang: DES,
      kdpemda: kdpemda,
      kdkppn: kppn,
    };

    const allMonthsData = [
      januari,
      pebruari,
      maret,
      april,
      mei,
      juni,
      juli,
      agustus,
      september,
      oktober,
      november,
      desember,
    ];

    // Async function to save data to the database
    async function saveAllMonthsData(data) {
      try {
        const results = await Promise.all(
          data.map(async (entry) => {
            const result = await Ref_pencabutan.create(entry);

            return result;
          })
        );
      } catch (error) {
        console.error("Gagal menyimpan data:", error);
      }
    }

    // Save data for all months
    await saveAllMonthsData(allMonthsData);

    await Ref_pencabutan.destroy({
      where: {
        [Op.or]: [
          { kdpemda: { [Op.is]: null } },
          { kdkppn: { [Op.is]: null } },
          { jenis: { [Op.is]: null } },
          { kriteria: { [Op.is]: null } },
          { kmk_tunda: { [Op.is]: null } },
        ],
      },
    });

    await Ref_pencabutan.destroy({
      where: {
        kdpemda: kdpemda,
        kdkppn: kppn,
        bulan: "0",
      },
    });

    await Ref_kmk_pencabutan.destroy({
      where: {
        kdpemda: kdpemda,
        kdkppn: kppn,
        jenis: jenis,
        kriteria: kriteria,
        kmk_cabut: KMK_CABUT,
        kmk_tunda: NO_KMK,
        [Op.and]: [{ kdpemda: kdpemda }],
      },
    });

    const pencabutanData = await Ref_pencabutan.findAll({
      attributes: [
        "thang",
        "jenis",
        "kriteria",
        "kmk_tunda",
        "kmk_cabut",
        "alias",
        "waktu",
        "kdkppn",
        "kdpemda",
        "uang", // Assuming this column holds the values for different months
        "bulan", // Assuming this column represents the month number
      ],
      where: {
        kdpemda: kdpemda,
        kdkppn: kppn,
        jenis: jenis,
        kriteria: kriteria,
        kmk_tunda: NO_KMK,
        kmk_cabut: KMK_CABUT,
        [Op.and]: [
          { kdpemda: kdpemda }, // Repeated condition if necessary
        ],
      },
    });

    // Transform the retrieved data into the format required for insertion
    const transformedData = pencabutanData.map((entry) => ({
      thang: entry.thang,
      jenis: entry.jenis,
      kriteria: entry.kriteria,
      kmk_tunda: entry.kmk_tunda,
      kmk_cabut: entry.kmk_cabut,
      alias: entry.alias,
      waktu: entry.waktu,
      kdkppn: entry.kdkppn,
      kdpemda: entry.kdpemda,
      jan: entry.bulan === "01" ? entry.uang : 0,
      peb: entry.bulan === "02" ? entry.uang : 0,
      mar: entry.bulan === "03" ? entry.uang : 0,
      apr: entry.bulan === "04" ? entry.uang : 0,
      mei: entry.bulan === "05" ? entry.uang : 0,
      jun: entry.bulan === "06" ? entry.uang : 0,
      jul: entry.bulan === "07" ? entry.uang : 0,
      ags: entry.bulan === "08" ? entry.uang : 0,
      sep: entry.bulan === "09" ? entry.uang : 0,
      okt: entry.bulan === "10" ? entry.uang : 0,
      nov: entry.bulan === "11" ? entry.uang : 0,
      des: entry.bulan === "12" ? entry.uang : 0,
    }));

    // Insert transformed data into 'ref_kmk_pencabutan' table
    await Ref_kmk_pencabutan.bulkCreate(transformedData);

    await Ref_kmk_pencabutan.destroy({
      where: {
        kdpemda: kdpemda,
        kdkppn: kppn,
        jenis: jenis,
        kriteria: kriteria,
        kmk_tunda: NO_KMK,
        jan: 0,
        peb: 0,
        mar: 0,
        apr: 0,
        mei: 0,
        jun: 0,
        jul: 0,
        ags: 0,
        sep: 0,
        okt: 0,
        nov: 0,
        des: 0,
        [Op.and]: [
          { kdpemda: kdpemda }, // Repeated condition if necessary
        ],
      },
    });

    // Update records in 'penundaan' table
    await Ref_Penundaan.update(
      { uang: "0" }, // Set 'uang' column to '0'
      {
        where: {
          bulan: { [Op.gt]: formattedBulan },
          kdkppn: kppn,
          kmk_tunda: NO_KMK,
          kdpemda: kdpemda,
          // jenis: jenis,
          kriteria: kriteria,
        },
      }
    );

    const updateObj = {
      kmk_cabut: KMK_CABUT, // Setting 'kmk_cabut' column to '$no_kmk_pencabutan' for all cases
    };

    // Based on $cabutbulancair value, setting columns to '0' accordingly
    switch (BULANCABUT) {
      case "01":
        updateObj.peb = 0;
      case "02":
        updateObj.mar = 0;
      case "03":
        updateObj.apr = 0;
      case "04":
        updateObj.mei = 0;
      case "05":
        updateObj.jun = 0;
      case "06":
        updateObj.jul = 0;
      case "07":
        updateObj.ags = 0;
      case "08":
        updateObj.sep = 0;
      case "09":
        updateObj.okt = 0;
      case "10":
        updateObj.nov = 0;
      case "11":
        updateObj.des = 0;
        break;
    }

    // Update records in 'Ref_kmk_penundaan' table
    await Ref_kmk_Penundaan_Model.update(updateObj, {
      where: {
        no_kmk: potong,
        kdpemda: kdpemda,
        kdkppn: kppn,
        jenis: jenis,
        kriteria: kriteria,
      },
    });

    async function getDataAndInsert() {
      try {
        // Lakukan SELECT data dengan kriteria tertentu dari tabel ref_kmk_pencabutan
        const selectedData = await getSelectedData();

        // Jika data berhasil terpilih, lakukan INSERT ke tabel ref_kmk_penundaan
        if (selectedData) {
          await insertData(selectedData);
          console.log("Data berhasil dimasukkan ke tabel ref_kmk_penundaan.");
        } else {
          console.log("Tidak ada data yang dipilih.");
        }
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      }
    }

    async function getSelectedData() {
      try {
        // Lakukan SELECT data dari tabel ref_kmk_pencabutan dengan kriteria tertentu
        const selectedData = await Ref_kmk_pencabutan.findAll({
          where: {
            kdkppn: kppn,
            kdpemda: kdpemda,
            kmk_tunda: NO_KMK,
            // jenis: jenis,
            kriteria: kriteria,
          },
          attributes: [
            "kdkppn",
            "kdpemda",
            "jenis",
            "kriteria",
            [Sequelize.fn("SUM", Sequelize.col("jan")), "jan"],
            [Sequelize.fn("SUM", Sequelize.col("peb")), "peb"],
            [Sequelize.fn("SUM", Sequelize.col("mar")), "mar"],
            [Sequelize.fn("SUM", Sequelize.col("apr")), "apr"],
            [Sequelize.fn("SUM", Sequelize.col("mei")), "mei"],
            [Sequelize.fn("SUM", Sequelize.col("jun")), "jun"],
            [Sequelize.fn("SUM", Sequelize.col("jul")), "jul"],
            [Sequelize.fn("SUM", Sequelize.col("ags")), "ags"],
            [Sequelize.fn("SUM", Sequelize.col("sep")), "sep"],
            [Sequelize.fn("SUM", Sequelize.col("okt")), "okt"],
            [Sequelize.fn("SUM", Sequelize.col("nov")), "nov"],
            [Sequelize.fn("SUM", Sequelize.col("des")), "des"],
          ],
          group: ["kdkppn", "kdpemda", "jenis", "kriteria"],
        });

        return selectedData;
      } catch (error) {
        throw error;
      }
    }

    async function insertData(selectedData) {
      try {
        // Lakukan iterasi terhadap data yang terpilih dan lakukan INSERT ke tabel ref_kmk_penundaan
        for (const data of selectedData) {
          await Ref_kmk_Penundaan_Model.create({
            thang: thang,
            jenis: data.jenis,
            kriteria: data.kriteria,
            no_kmk: NO_KMK,
            uraian: "SUDAH DILAKUKAN PENCABUTAN",
            kdkppn: kppn,
            kdpemda: kdpemda,
            jan: data.jan,
            peb: data.peb,
            mar: data.mar,
            apr: data.apr,
            mei: data.mei,
            jun: data.jun,
            jul: data.jul,
            ags: data.ags,
            sep: data.sep,
            okt: data.okt,
            nov: data.nov,
            des: data.des,
            update_data: currentDate,
            status_cabut: "1",
            kmk_cabut: KMK_CABUT,
          });
        }
      } catch (error) {
        throw error;
      }
    }

    // const insertedData = await Sequelize.query(
    //   `INSERT INTO tkd.ref_kmk_penundaan
    //     (thang, jenis, kriteria, no_kmk, uraian, kdkppn, kdpemda, jan, peb, mar, apr, mei, jun, jul, ags, sep, okt, nov, des, update_data, status_cabut, kmk_cabut)
    //     SELECT thang, jenis, kriteria, kmk_tunda, 'SUDAH DILAKUKAN PENCABUTAN', kdkppn, kdpemda,
    //     SUM(jan) jan, SUM(peb) peb, SUM(mar) mar, SUM(apr) apr, SUM(mei) mei, SUM(jun) jun, SUM(jul) jul,
    //     SUM(ags) ags, SUM(sep) sep, SUM(okt) okt, SUM(nov) nov, SUM(des) des, NOW(), '1', :KMK_CABUT
    //     FROM tkd.ref_kmk_pencabutan
    //     WHERE kdkppn= :kppn AND kdpemda= :kdpemda AND kmk_tunda= :NO_KMK AND jenis= :jenis AND kriteria= :kriteria
    //     GROUP BY kdkppn, kdpemda, jenis, kriteria`,
    //   {
    //     replacements: {
    //       KMK_CABUT: KMK_CABUT,
    //       kppn: kppn,
    //       kdpemda: kdpemda,
    //       NO_KMK: NO_KMK,
    //       jenis: jenis,
    //       kriteria: kriteria,
    //     },
    //     type: Sequelize.QueryTypes.INSERT,
    //   }
    // );
    await getDataAndInsert();
    res.status(200).json({ msg: "Data Pencabutan Berhasil Disimpan" });
  }
};

export const generateData = async (req, res) => {
  const kppn = req.query.kppn;
  const kdpemda = req.query.kdpemda;
  const thang = req.query.thang;
  const bulan = req.query.bulan;

  try {
    // Delete records
    await Rekap.destroy({
      where: {
        kdpemda: kdpemda,
      },
    });

    // Insert records
    const resultsQuery = `INSERT INTO tkd.rekap(thang,bulan,kdkppn,nmkppn,kdpemda,nmpemda,nmbulan,pagu,alokasi_bulan,tunda,cabut,potongan)
    SELECT a.thang,a.bulan,a.kdkppn,a.nmkppn,a.kdpemda,a.nmpemda,namabulan,
    SUM(a.dau_tidak_ditentukan) pagu,SUM(a.alokasi) alokasi_bulan,tunda,cabut, potongan
    FROM tkd.alokasi_bulanan_list a 
    LEFT OUTER JOIN (
    SELECT c.kdkppn,c.kdpemda,c.bulan,SUM(c.uang) tunda
       FROM tkd.penundaan c
       GROUP BY c.kdkppn,c.kdpemda,c.bulan
    ) c ON a.kdkppn=c.kdkppn AND a.kdpemda=c.kdpemda AND a.bulan=c.bulan

    LEFT OUTER JOIN (
    SELECT d.kdkppn,d.kdpemda,d.bulan,SUM(d.uang) cabut
    FROM tkd.pencabutan d  GROUP BY d.kdkppn,d.kdpemda,d.bulan
    ) d ON a.kdkppn=d.kdkppn AND a.kdpemda=d.kdpemda AND a.bulan=d.bulan
    LEFT OUTER JOIN (
    SELECT b.kdkabkota,b.bulan,b.kdkppn,b.nmbulan,b.kdakun,SUM(b.nilai) potongan FROM tkd.detail_kmk_dau b
    GROUP BY b.kdkppn,b.kdkabkota,b.bulan) b ON a.kdkppn=b.kdkppn AND a.kdpemda=b.kdkabkota AND a.bulan=b.bulan 

    LEFT OUTER JOIN (
    SELECT e.nmbulan namabulan,e.bulan FROM tkd.ref_bulan e
    ) e ON a.bulan=e.bulan 
    WHERE a.kdpemda='${kdpemda}'  GROUP BY a.bulan,a.kdkppn,a.kdpemda`;

    const [results] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.INSERT, // Assuming it's an INSERT query
      }),
    ]);

    // Update queries using Sequelize
    await Rekap.update(
      { tunda: 0 },
      {
        where: {
          tunda: null,
          kdpemda: kdpemda,
        },
      }
    );

    await Rekap.update(
      { cabut: 0 },
      {
        where: {
          cabut: null,
          kdpemda: kdpemda,
        },
      }
    );

    await Rekap.update(
      { potongan: 0 },
      {
        where: {
          potongan: null,
          kdpemda: kdpemda,
        },
      }
    );

    // Calculating 'salur' value
    await Rekap.update(
      {
        salur: Sequelize.literal("(alokasi_bulan+cabut)-(tunda+potongan)"),
      },
      {
        where: {
          kdpemda: kdpemda,
        },
      }
    );

    res.json({ result: "Data inserted successfully" });
  } catch (error) {
    console.error("Error in processing query:", error);
    const errorMessage = error.original
      ? error.original.sqlMessage
      : "Terjadi kesalahan dalam memproses permintaan.";
    res.status(500).json({ error: errorMessage });
  }
};

export const generateDataRekon = async (req, res) => {
  try {
    await Rekap.destroy({
      truncate: true, // Menghapus seluruh data tabel
      restartIdentity: true, // Mulai ulang identitas kolom otomatis
    });
    await Data_beda.truncate();

    // Insert records
    const resultsQuery = `INSERT INTO tkd.rekap(thang,bulan,kdkppn,nmkppn,kdpemda,nmpemda,nmbulan,pagu,alokasi_bulan,tunda,cabut,potongan)
    SELECT a.thang,a.bulan,a.kdkppn,a.nmkppn,a.kdpemda,a.nmpemda,namabulan,
    SUM(a.dau_tidak_ditentukan) pagu,SUM(a.alokasi) alokasi_bulan,tunda,cabut, potongan
    FROM tkd.alokasi_bulanan_list a 
    LEFT OUTER JOIN (
    SELECT c.kdkppn,c.kdpemda,c.bulan,SUM(c.uang) tunda
       FROM tkd.penundaan c
       GROUP BY c.kdkppn,c.kdpemda,c.bulan
    ) c ON a.kdkppn=c.kdkppn AND a.kdpemda=c.kdpemda AND a.bulan=c.bulan

    LEFT OUTER JOIN (
    SELECT d.kdkppn,d.kdpemda,d.bulan,SUM(d.uang) cabut
    FROM tkd.pencabutan d  GROUP BY d.kdkppn,d.kdpemda,d.bulan
    ) d ON a.kdkppn=d.kdkppn AND a.kdpemda=d.kdpemda AND a.bulan=d.bulan
    LEFT OUTER JOIN (
    SELECT b.kdkabkota,b.bulan,b.kdkppn,b.nmbulan,b.kdakun,SUM(b.nilai) potongan FROM tkd.detail_kmk_dau b
    GROUP BY b.kdkppn,b.kdkabkota,b.bulan) b ON a.kdkppn=b.kdkppn AND a.kdpemda=b.kdkabkota AND a.bulan=b.bulan 

    LEFT OUTER JOIN (
    SELECT e.nmbulan namabulan,e.bulan FROM tkd.ref_bulan e
    ) e ON a.bulan=e.bulan 
    GROUP BY a.bulan,a.kdkppn,a.kdpemda`;

    const [results] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.INSERT,
      }),
    ]);

    await Rekon_potongan.truncate();
    const rekon_potongan = `
  INSERT INTO data_omspan.rekon_potongan(thang,bulan, kdkppn, kdpemda, akun_pusat, nilai_pusat)
  SELECT thang,bulan, kdkppn, kdkabkota, kdakun, nilai FROM tkd.detail_kmk_dau`;
    const [rekon] = await Promise.all([
      db.query(rekon_potongan, {
        type: Sequelize.QueryTypes.INSERT,
      }),
    ]);

    const update_potongan = `
       UPDATE data_omspan.rekon_potongan a
    LEFT JOIN (
      SELECT periode, kode_kppn, kode_pemda, akun, nilai_pemotongan
      FROM data_omspan.data_pemotongan
    ) b 
    ON a.bulan = b.periode AND a.kdkppn = b.kode_kppn AND a.kdpemda = b.kode_pemda AND a.akun_pusat = b.akun
    SET a.akun_omspan = b.akun, a.nilai_omspan = b.nilai_pemotongan`;

    const [update] = await Promise.all([
      db.query(update_potongan, {
        type: Sequelize.QueryTypes.INSERT,
      }),
    ]);

    await Rekon_penundaan.truncate();
    const rekon_penundaan = `INSERT INTO data_omspan.rekon_penundaan(thang,bulan,kdkppn,kdpemda,nilai_pusat)
    SELECT thang,bulan,kdkppn,kdpemda,tunda FROM tkd.rekap`;
    const [tunda] = await Promise.all([
      db.query(rekon_penundaan, {
        type: Sequelize.QueryTypes.INSERT,
      }),
    ]);

    const update_penundaan = `UPDATE data_omspan.rekon_penundaan a LEFT JOIN (
      SELECT b.periode,b.kode_kppn,b.kode_pemda,SUM(b.nilai_penundaan) tundaomspan
      FROM data_omspan.data_penundaan b GROUP BY b.periode,b.kode_kppn,b.kode_pemda) b 
      ON a.bulan=b.periode  AND a.kdkppn=b.kode_kppn AND a.kdpemda=b.kode_pemda
      SET a.nilai_omspan=tundaomspan`;

    const [updatetunda] = await Promise.all([
      db.query(update_penundaan, {
        type: Sequelize.QueryTypes.INSERT,
      }),
    ]);

    await Rekon_penundaan.update(
      { nilai_pusat: 0 },
      {
        where: {
          nilai_pusat: null,
        },
      }
    );

    await Rekon_penundaan.update(
      { nilai_omspan: 0 },
      {
        where: {
          nilai_omspan: null,
        },
      }
    );

    await Rekon_potongan.update(
      { akun_omspan: 0 },
      {
        where: {
          akun_omspan: null,
        },
      }
    );

    await Rekon_potongan.update(
      { nilai_omspan: 0 },
      {
        where: {
          nilai_omspan: null,
        },
      }
    );

    await Rekap.update(
      { tunda: 0 },
      {
        where: {
          tunda: null,
        },
      }
    );

    await Rekap.update(
      { cabut: 0 },
      {
        where: {
          cabut: null,
        },
      }
    );

    await Rekap.update(
      { potongan: 0 },
      {
        where: {
          potongan: null,
        },
      }
    );

    await Rekap.update(
      {
        salur: Sequelize.literal(
          "(alokasi_bulan + cabut) - (tunda + potongan)"
        ),
      },
      {
        where: {}, // Klausa WHERE kosong untuk update seluruh baris
      }
    );

    const databeda = `INSERT INTO data_omspan.data_beda (thang,periode,kdkppn,kdpemda)
    SELECT DISTINCT thang,bulan,kdkppn,kdpemda FROM data_omspan.rekon_penundaan WHERE nilai_pusat<>nilai_omspan UNION 
    SELECT DISTINCT thang,bulan,kdkppn,kdpemda FROM data_omspan.rekon_potongan WHERE (nilai_pusat<>nilai_omspan) OR (akun_omspan<>akun_pusat)
    `;

    const [beda] = await Promise.all([
      db.query(databeda, {
        type: Sequelize.QueryTypes.INSERT,
      }),
    ]);

    const currentDate = moment().format("DD-MM-YYYY HH:mm:ss");
    res.json({
      result: "Data inserted successfully",
      tgupdate: currentDate,
    });
  } catch (error) {
    console.error("Error in processing query:", error);
    const errorMessage = error.original
      ? error.original.sqlMessage
      : "Terjadi kesalahan dalam memproses permintaan.";
    res.status(500).json({ error: errorMessage });
  }
};

export const RekonOmspan = async (req, res) => {
  const queryParams = req.query.queryParams;
  const thang = req.query.thang;
  const bulan = req.query.bulan;
  const kdkppn = req.query.kdkppn;
  const kdpemda = req.query.kdpemda;
  const decryptedData = decryptData(queryParams).replace(/"/g, "");

  try {
    const resultsQuery = `${decryptedData} `;

    const [results] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const dataPotongan = await Ref_kmk_Detail_Model.findAll({
      attributes: ["thang", "bulan", "kdkppn", "kdkabkota", "kdakun", "nilai"],
      where: {
        thang: thang,
        bulan: bulan,
        kdkabkota: kdpemda,
        kdkppn: kdkppn,
      },
    });

    const modifiedResults = results.map((item) => {
      const potonganData = dataPotongan.filter(
        (data) =>
          data.thang === item.thang &&
          data.bulan === item.bulan &&
          data.kdkabkota === item.kdpemda &&
          data.kdkppn === item.kdkppn
      );

      const potongan = potonganData.map((data) => ({
        akun: data.kdakun,
        nilai: parseInt(data.nilai),
      }));

      return {
        ...item,
        pagu: parseInt(item.pagu),
        alokasi_bulan: parseInt(item.alokasi_bulan),
        // cabut: parseInt(item.cabut),
        detail_potongan: potongan.length > 0 ? potongan : [],
        salur: parseInt(item.salur),
        tunda: parseInt(item.tunda),
        // total_potongan: parseInt(item.potongan),
      };
    });

    res.json({
      result: modifiedResults,
    });
  } catch (error) {
    console.error("Error in processing query:", error);
    const errorMessage = error.original
      ? error.original.sqlMessage
      : "Terjadi kesalahan dalam memproses permintaan.";
    res.status(500).json({ error: errorMessage });
  }
};

export const endpointRekon = async (req, res) => {
  const { thang, bulan, kdkppn, kdpemda } = req.query;

  if (!thang || !bulan || !kdkppn || !kdpemda) {
    return res.status(400).json({ error: "Params tidak lengkap" });
  }

  const getData = async (RekapModel, RefDetailModel) => {
    const results = await RekapModel.findAll({
      attributes: [
        "thang",
        "bulan",
        "nmbulan",
        "kdpemda",
        "nmpemda",
        "kdkppn",
        "nmkppn",
        "pagu",
        "alokasi_bulan",
        "tunda",
        "potongan",
        "salur",
      ],
      where: { thang, bulan, kdpemda, kdkppn },
    });

    const dataPotongan = await RefDetailModel.findAll({
      attributes: ["thang", "bulan", "kdkppn", "kdkabkota", "kdakun", "nilai"],
      where: { thang, bulan, kdkabkota: kdpemda, kdkppn },
    });

    return results.map((item) => {
      const potonganData = dataPotongan.filter(
        (data) =>
          data.thang === item.thang &&
          data.bulan === item.bulan &&
          data.kdkabkota === item.kdpemda &&
          data.kdkppn === item.kdkppn
      );

      const potongan = potonganData.map((data) => ({
        akun: data.kdakun,
        nilai: parseInt(data.nilai, 10),
      }));

      return {
        ...item.get({ plain: true }),
        pagu: parseInt(item.pagu || 0, 10),
        alokasi_bulan: parseInt(item.alokasi_bulan || 0, 10),
        detail_potongan: potongan.length > 0 ? potongan : [],
        salur: parseInt(item.salur || 0, 10),
        tunda: parseInt(item.tunda || 0, 10),
      };
    });
  };

  try {
    let RekapModel, RefDetailModel;

    if (thang === "2024") {
      RekapModel = Rekap; // Model untuk database 2024
      RefDetailModel = Ref_kmk_Detail_Model;
    } else if (thang === "2025") {
      RekapModel = Rekap25; // Model untuk database 2025
      RefDetailModel = Ref_kmk_Detail_Model25;
    } else {
      return res.status(400).json({ error: "Tahun anggaran tidak valid" });
    }

    const modifiedResults = await getData(RekapModel, RefDetailModel);

    if (modifiedResults.length === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }

    res.json({ data: modifiedResults });
  } catch (error) {
    console.error("Error in processing query:", error);
    const errorMessage = error.original
      ? error.original.sqlMessage
      : "Terjadi kesalahan dalam memproses permintaan.";
    res.status(500).json({ error: errorMessage });
  }
};


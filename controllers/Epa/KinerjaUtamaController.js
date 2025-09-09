import KinerjaUtama from "../../models/EpaModel/KinerjaUtamaModel.js";
import PaguSoutput from "../../models/EpaModel/Pagu_Soutput.js";
import PaguUtama from "../../models/EpaModel/Pagu_Utama.js";
import db from "../../config/Database10.js";
import { decryptData } from "../../middleware/Decrypt.js";

// Get all records
export const getAllKinerja = async (req, res) => {
  try {
    const { keyId } = req.query;
    // console.log(keyId);

    const kinerja = await KinerjaUtama.findAll({ where: { keyId: keyId } });
    res.status(200).json(kinerja);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

// Get single record by ID
export const getKinerjaById = async (req, res) => {
  try {
    const { id } = req.params;
    const kinerja = await KinerjaUtama.findByPk(id);
    if (!kinerja) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.status(200).json(kinerja);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

// Create new record
export const createKinerja = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !data.title || !data.description || !data.dataEpa) {
      return res.status(400).json({
        message: "Format payload tidak sesuai atau data kurang lengkap",
      });
    }

    const { title, description, jenis, dataEpa } = data;
    const { kodeKanwil, lokasiKanwil, kddept, period, year, username } =
      dataEpa;
    // console.log(jenis);

    const periodOptions = [
      "Januari",
      "Pebruari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const monthIndex = periodOptions.indexOf(period);
    if (monthIndex === -1) {
      return res.status(400).json({ message: "Periode tidak valid!" });
    }

    const monthNumber = String(monthIndex + 1).padStart(2, "0");
    const key = `${year}${monthNumber}${kodeKanwil}${lokasiKanwil}${kddept}`;

    // Hapus data dengan key yang sama jika ada
    await KinerjaUtama.destroy({ where: { keyId: key, jenis: jenis } });

    // Insert data baru
    const newKinerja = await KinerjaUtama.create({
      thang: year,
      periode: monthNumber,
      kdkanwil: kodeKanwil,
      kdlokasi: lokasiKanwil,
      kdddept: kddept,
      username: username,
      jenis: jenis,
      judul: title,
      deskripsi: description,
      keyId: key,
    });

    res
      .status(201)
      .json({ message: "Data berhasil ditambahkan", data: newKinerja });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

// Update record
export const updateKinerja = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      thang,
      periode,
      kdkanwil,
      kdlokasi,
      kdddept,
      username,
      jenis,
      judul,
      deskripsi,
      keyId,
    } = req.body;

    const kinerja = await KinerjaUtama.findByPk(id);
    if (!kinerja) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    await kinerja.update({
      thang,
      periode,
      kdkanwil,
      kdlokasi,
      kdddept,
      username,
      jenis,
      judul,
      deskripsi,
      keyId,
    });

    res
      .status(200)
      .json({ message: "Data berhasil diperbarui", data: kinerja });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

// Delete record
export const deleteKinerja = async (req, res) => {
  try {
    const { id } = req.params;
    const kinerja = await KinerjaUtama.findByPk(id);
    if (!kinerja) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    await kinerja.destroy();
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

// Endpoint: /epa/pagu-real-utama

export const getPaguRealUtama = async (req, res) => {
  try {
    const encryptedQuery = req.query.query;
    if (!encryptedQuery) {
      return res
        .status(400)
        .json({ message: "Query terenkripsi tidak ditemukan" });
    }

    // Dekripsi query
    const sqlQuery = decryptData(encryptedQuery).replace(/"/g, "");

    if (!sqlQuery || typeof sqlQuery !== "string") {
      return res.status(400).json({ message: "Query SQL tidak valid" });
    }

    const result = await db.query(sqlQuery, {
      type: db.QueryTypes.SELECT,
    });
    res.status(200).json({ result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Endpoint: /epa/pagu-real-utama-soutput
export const getPaguRealSoutput = async (req, res) => {
  try {
    const encryptedQuery = req.query.query;
    if (!encryptedQuery) {
      return res
        .status(400)
        .json({ message: "Query terenkripsi tidak ditemukan" });
    }

    // Dekripsi query
    const sqlQuery = decryptData(encryptedQuery).replace(/"/g, "");

    if (!sqlQuery || typeof sqlQuery !== "string") {
      return res.status(400).json({ message: "Query SQL tidak valid" });
    }

    const result = await db.query(sqlQuery, {
      type: db.QueryTypes.SELECT,
    });
    res.status(200).json({ result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

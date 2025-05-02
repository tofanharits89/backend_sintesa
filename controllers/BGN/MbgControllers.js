import db from "../../config/Database135MBG.js";

import Komoditas from "../../models/mbg/MbgModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Mendapatkan __dirname di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Controller untuk menyimpan data komoditas
export const simpanKomoditas = async (req, res) => {
  try {
    const { kdkanwil, kabkota, kdlokasi, komoditas, volume, sppg, username } =
      req.body.formData;

    // Validasi sederhana (optional, kalau mau lebih kuat pakai middleware validator)
    if (
      !kdkanwil ||
      !kabkota ||
      !kdlokasi ||
      !komoditas ||
      !volume ||
      !sppg ||
      !username
    ) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Simpan ke database
    const data = await Komoditas.create({
      kdkanwil,
      kabkota,
      kdlokasi,
      komoditas,
      volume,
      sppg,
      username,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({ message: "Data komoditas berhasil disimpan", data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Gagal menyimpan data", error: error.message });
  }
};

// Controller untuk menghapus data komoditas berdasarkan id
export const hapusKomoditas = async (req, res) => {
  try {
    const { id, kdkanwil } = req.params;

    const komoditas = await Komoditas.findOne({
      where: { id: id, kdkanwil: kdkanwil },
    });

    if (!komoditas) {
      return res
        .status(404)
        .json({ message: "Data tidak ditemukan atau kdkanwil tidak cocok" });
    }

    await komoditas.destroy();

    res.status(200).json({ message: "Data komoditas berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Gagal menghapus data", error: error.message });
  }
};

export const getTableMbg = async (req, res) => {
  try {
    // Query untuk mendapatkan daftar tabel
    const [results, metadata] = await db.query("SHOW TABLES");

    // Ambil nama tabel dari hasil query
    const tableKey = Object.keys(results[0])[0]; // Biasanya "Tables_in_database"
    const tables = results.map((row) => row[tableKey]);

    res.json(tables); // Mengirimkan daftar tabel sebagai respons
  } catch (err) {
    console.error("Gagal mengambil nama tabel:", err);
    res.status(500).json({ message: "Gagal mengambil nama tabel." });
  }
};

import RekamBPS from "../models/rekambps_model.js";
import RekamBapanas from "../models/rekambapanas_model.js";
import RekamTriwulan from "../models/rekamtriwulan_model.js";
import db from "../config/Database.js"; // Sesuaikan path ke file database.js kamu
import { QueryTypes } from "sequelize";



// ----------------- BPS -----------------

export const getAllBPS = async (req, res) => {
  try {
    const rows = await RekamBPS.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rekamBPS = async (req, res) => {
  try {
    const newData = await RekamBPS.create(req.body);
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBPS = async (req, res) => {
  try {
    await RekamBPS.destroy({ where: { id: req.params.id } });
    res.json({ message: "Data BPS berhasil dihapus" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateBPS = async (req, res) => {
  const { id } = req.params;
  const { tahun, kanwil, triwulan, indikator, komoditas, satuan, keterangan } = req.body;
  const updatedAt = new Date();

  try {
    const [result] = await db.query(
      `UPDATE rekam_bps SET tahun = ?, kanwil = ?, triwulan = ?, indikator = ?, komoditas = ?, satuan = ?, keterangan = ?, updatedAt = ? WHERE id = ?`,
      {
        replacements: [tahun, kanwil, triwulan, indikator, komoditas, satuan, keterangan, updatedAt, id],
        type: QueryTypes.UPDATE,
      }
    );

    if (result === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json({ message: "Data berhasil diperbarui" });
  } catch (error) {
    console.error("Error di updateBPS:", error);
    res.status(500).json({ message: "Gagal update data", detail: error });
  }
};



// ----------------- Bapanas -----------------

export const getAllBapanas = async (req, res) => {
  try {
    const rows = await RekamBapanas.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rekamBapanas = async (req, res) => {
  try {
    const newData = await RekamBapanas.create(req.body);
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBapanas = async (req, res) => {
  try {
    await RekamBapanas.destroy({ where: { id: req.params.id } });
    res.json({ message: "Data Bapanas berhasil dihapus" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ----------------- Triwulan -----------------

export const getAllTriwulan = async (req, res) => {
  try {
    const rows = await RekamTriwulan.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rekamTriwulan = async (req, res) => {
  try {
    const newData = await RekamTriwulan.create(req.body);
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTriwulan = async (req, res) => {
  try {
    await RekamTriwulan.destroy({ where: { id: req.params.id } });
    res.json({ message: "Data Triwulan berhasil dihapus" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

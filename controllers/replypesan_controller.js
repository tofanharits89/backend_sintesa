// controllers/replypesan_controller.js

import Notifikasi from "../models/notifikasi/notifikasiModel.js"; // Pastikan path model benar

// Ambil semua balasan untuk satu notifikasi utama
export const getRepliesByNotifikasiId = async (req, res) => {
  try {
    const { notifikasiId } = req.params;
    const replies = await Notifikasi.findAll({
      where: { parent_id: notifikasiId },
      order: [['createdAt', 'ASC']]
    });
    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buat balasan baru ke satu notifikasi
export const createReply = async (req, res) => {
  // console.log(req.params);
  
  try {
    const { notifikasiId } = req.params;
    const { user, text } = req.body;

    if (!user || !text) {
      return res.status(400).json({ error: "User dan text wajib diisi" });
    }

    // Pastikan field lain diisi default jika dibutuhkan oleh model
    const reply = await Notifikasi.create({
      parent_id: notifikasiId,
      isi: text,
      dari: user,
      tujuan: '',              // Atur sesuai kebutuhan aplikasi
      tipe_notif: 'pesan',     // 'pesan' untuk reply
      judul: 'Balasan Pesan',  // Judul default, boleh diganti
      status: 'false',         // Default unread
      pinned: 'false',         // Default tidak dipinned
      tipe: 'biasa',           // Default, boleh disesuaikan
      filename: null           // Default, kalau ada file lampiran isi sesuai
      // Tambahkan kolom lain jika ada di model
    });

    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

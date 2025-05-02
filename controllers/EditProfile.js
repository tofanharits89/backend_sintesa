import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import Users from "../models/UserModel.js";

export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { originalname, buffer } = req.image;
    const extname = path.extname(originalname);
    const randomFileName = `${uuidv4()}${extname}`;
    const imageFilePath = path.join("public/foto/", randomFileName);

    // Cari pengguna berdasarkan userId
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).send("Pengguna tidak ditemukan.");
    }

    if (user.image) {
      // Jika gambar profil sudah ada, pengguna dapat memilih untuk menggantinya atau tidak
      if (req.body.replaceImage === "true") {
        // Jika pengguna ingin mengganti foto profil, hapus yang lama
        const oldImageFilePath = path.join("public/foto/", user.image);
        fs.unlinkSync(oldImageFilePath);
        user.image = randomFileName;
      }
    } else {
      // Jika gambar profil masih kosong, wajib diisi
      user.image = randomFileName;
    }

    // Simpan foto profil di server
    fs.writeFileSync(imageFilePath, buffer);

    // Simpan perubahan di basis data
    await user.save();

    res.send("Foto profil berhasil diunggah dan disimpan.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat mengunggah foto profil.");
  }
};

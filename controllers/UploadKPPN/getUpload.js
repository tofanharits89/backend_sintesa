import multer from "multer";
import path from "path";
import UploadKPPNModel from "../../models/uploadkppn/uploadKPPNModel.js";
import fs from "fs";

// Path baru di Drive D
const uploadDir = "D:/UploadKPPN";

// Pastikan folder tujuan ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi penyimpanan Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.body.kppn}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

export const getUpload = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("Multer Error:", err);
      return res
        .status(422)
        .json({ msg: "Invalid ZIP/RAR", error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No File Uploaded" });
    }

    const { tahun, kppn, periode, subperiode, uraian, jenis, username } =
      req.body;

    if (!kppn) {
      return res.status(400).json({ msg: "KPPN is required" });
    }

    const parts = kppn.split("-");
    if (parts.length < 2) {
      return res.status(400).json({ msg: "Invalid KPPN format" });
    }

    const kodekppn = parts[0];
    const kodesatker = parts[1];

    const fileSize = req.file.size;
    const ext = path.extname(req.file.originalname);
    const fileName = req.file.filename;
    const url = `D:/UploadKPPN/${fileName}`; // Path baru
    const allowedType = [".rar", ".zip"];

    if (!allowedType.includes(ext.toLowerCase())) {
      return res
        .status(422)
        .json({
          msg: `Invalid file type. Allowed types: ${allowedType.join(", ")}`,
        });
    }

    if (fileSize > 10 * 1024 * 1024) {
      return res.status(422).json({ msg: "File must be less than 10 MB" });
    }

    try {
      const currentDate = new Date();
      await UploadKPPNModel.create({
        tahun,
        kdkppn: kodekppn,
        kdsatker: kodesatker,
        jenis,
        periode,
        subperiode,
        file: url, // Path baru
        tipe: ext,
        filename: fileName,
        ukuran: fileSize,
        username,
        catatan: uraian,
        waktu: currentDate,
        fileasli: req.file.originalname,
        nilai: 0,
      });

      res.status(201).json({ msg: "Laporan Berhasil Disimpan" });
    } catch (error) {
      console.error("Database Error:", error.message);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  });
};

// Hapus File Upload
export const hapusupload = async (req, res) => {
  try {
    const fileuploadID = await UploadKPPNModel.findOne({
      attributes: ["id", "filename"],
      where: { id: req.params.id },
    });

    if (!fileuploadID)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (fileuploadID.filename) {
      const oldFilePath = path.join(uploadDir, fileuploadID.filename);

      // Hapus file dari folder D:/UploadKPPN
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log("File deleted:", oldFilePath);
      } else {
        console.log("File not found:", oldFilePath);
      }
    }

    // Hapus data dari database
    await UploadKPPNModel.destroy({ where: { id: req.params.id } });
    res.status(200).json({ msg: "Data Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

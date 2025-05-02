import multer from "multer";
import path from "path";
import UploadKanwilModel from "../../models/uploadkanwil/uploadKanwilModel.js";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/UploadKanwil"); // Tentukan direktori penyimpanan file
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.body.kanwil}-${Date.now()}${ext}`); // Beri nama file dengan timestamp
  },
});

const upload = multer({ storage });

export const getUploadKanwil = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(422).json({ msg: "Invalid ZIP/RAR" });
    }

    if (req.file === null) {
      return res.status(400).json({ msg: "No File Uploaded" });
    }

    // Check if req.file is defined before accessing its properties
    if (req.file && req.file.size) {
      const { tahun, kanwil, periode, uraian, jenis, username } = req.body;

      const fileSize = req.file.size;
      const ext = path.extname(req.file.originalname);
      const fileName = req.file.filename;
      const url = `${req.protocol}://${req.get(
        "host"
      )}/UploadKanwil/${fileName}`;
      const allowedType = [".rar", ".zip"];

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid ZIP/RAR" });
      }
      if (fileSize > 10000000) {
        return res.status(422).json({ msg: "File must be less than 10 MB" });
      }

      try {
        const currentDate = new Date();
        await UploadKanwilModel.create({
          tahun: tahun,
          kdkanwil: kanwil,
          jenis: jenis,
          periode: periode,

          file: url,
          tipe: ext,
          filename: fileName,
          ukuran: fileSize,
          username: username,
          catatan: uraian,
          waktu: currentDate,
          fileasli: req.file.originalname,
          nilai: 0,
        });
        res.status(201).json({ msg: "Laporan Berhasil Disimpan" });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
      }
    } else {
      return res.status(400).json({ msg: "File is missing or invalid" });
    }
  });
};

export const hapusuploadkanwil = async (req, res) => {
  try {
    const fileuploadID = await UploadKanwilModel.findOne({
      attributes: ["id", "filename"],
      where: {
        id: req.params.id,
      },
    });
    if (!fileuploadID)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    if (fileuploadID.filename) {
      const oldImageFilePath = path.join(
        "public/UploadKanwil/",
        fileuploadID.filename
      );
      fs.unlinkSync(oldImageFilePath);
      console.log(fileuploadID.filename);
    }
  } catch (error) {
    console.log(error.message);
  }

  try {
    await UploadKanwilModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Data Deleted Successfuly" });
    ioServer.emit("running_querys", "hapus upload kanwil");
  } catch (error) {
    console.log(error.message);
  }
};

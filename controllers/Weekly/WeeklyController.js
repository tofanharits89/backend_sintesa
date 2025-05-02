import WeeklyModel from "../../models/weekly/weeklyModels.js";
import fs from "fs";
import multer from "multer";
import path from "path";

// Konfigurasi penyimpanan file untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Weekly"); // Tentukan direktori penyimpanan file
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`); // Beri nama file dengan timestamp
  },
});

const upload = multer({ storage });

export const WeeklyUpload = (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(422).json({ msg: "Invalid File" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No File Uploaded" });
    }

    const {
      tahun,
      periode,
      bulan,
      tglawal,
      tglakhir,
      keterangan,
      jenisspm,
      nomorakhir,
    } = req.body;

    const file = req.file;
    const fileSize = file.size;
    const ext = path.extname(file.originalname);
    const fileName = file.filename;
    const url = `${req.protocol}://${req.get("host")}/weekly/${fileName}`;
    const allowedType = [".pdf", ".zip", ".rar", ".pptx"];

    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: "Invalid File" });
    }
    const bulanMap = {
      "01": "Januari",
      "02": "Februari",
      "03": "Maret",
      "04": "April",
      "05": "Mei",
      "06": "Juni",
      "07": "Juli",
      "08": "Agustus",
      "09": "September",
      10: "Oktober",
      11: "November",
      12: "Desember",
    };

    try {
      const nmbulan = bulanMap[bulan] || "mingguan";
      await WeeklyModel.create({
        tahun,
        periode,
        bulan,
        nmbulan,
        tglawal,
        tglakhir,
        keterangan,
        file: fileName,
      });
      res.status(201).json({ msg: "Data Berhasil Disimpan" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Terjadi Kesalahan" });
    }
  });
};

export const hapuswr = async (req, res) => {
  const user = await WeeklyModel.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "No Data Found" });

  try {
    const filepath = `./public/weekly/${user.file}`;
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await WeeklyModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Data WR Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const downloadFileWR = async (req, res) => {
  try {
    const { id } = req.params;

    // Log the received ID
    console.log(`Received download request for ID: ${id}`);

    // Fetch data by ID
    const weeklyData = await WeeklyModel.findByPk(id);

    if (!weeklyData) {
      console.log("Data not found for ID:", id);
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }

    const filePath = path.resolve("public", "Weekly", weeklyData.file);

    // Log the file path being checked
    console.log(`Checking file path: ${filePath}`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log("File not found at path:", filePath);
      return res.status(404).json({ msg: "File tidak ditemukan" });
    }

    const fileName = path.basename(filePath); // Get the correct file name from filePath

    // Log the file name being used for download
    console.log(`File found. Preparing to download file: ${fileName}`);

    // Read file before sending as response to client
    const data = fs.readFileSync(filePath);
    const fileExt = path.extname(fileName).toLowerCase();
    // console.log(fileExt);

    // Atur Content-Type berdasarkan ekstensi file
    let contentType = "application/octet-stream"; // Default content type
    switch (fileExt) {
      case ".pdf":
        contentType = "application/pdf";
        break;
      case ".txt":
        contentType = "text/plain";
        break;
      default:
        contentType = "application/octet-stream";
        break;
    }
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    res.send(data);

    // Log success
    console.log("File sent successfully");
  } catch (error) {
    // Log error details
    console.error("Error:", error.message);
    res.status(500).json({ msg: "Terjadi kesalahan" });
  }
};

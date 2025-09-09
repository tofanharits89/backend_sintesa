import Users from "../models/UserModel.js";
import User_log from "../models/User_log.js";
import fs from "fs";
import DataQuery from "../models/DataQuery.js";
import { Sequelize } from "sequelize";
import Log_menu from "../models/Log_menu.js";

import multer from "multer";
import path from "path";

// Konfigurasi penyimpanan file untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images"); // Tentukan direktori penyimpanan file
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`); // Beri nama file dengan timestamp
  },
});

const upload = multer({ storage });

export const simpanUser = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      // console.error("multer error on simpanUserOAuth:", err);
      return res.status(422).json({ msg: "Invalid Images" });
    }

    if (req.files === null) {
      return res.status(400).json({ msg: "No File Uploaded" });
    }

    const nama = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;
    const deptlimit = req.body.deptlimit;
    const telp = req.body.telp;
    const email = req.body.email;
    const kdkanwil = req.body.kdkanwil;
    const kdkppn = req.body.kdkppn;

    const file = req.file;
    const fileSize = file.size;
    const ext = path.extname(file.originalname);
    const fileName = file.filename;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: "Invalid Images" });
    }
    if (fileSize > 1000000) {
      return res.status(422).json({ msg: "Image must be less than 1 MB" });
    }

    const cekuser = await Users.findOne({ where: { username } });
    if (cekuser) {
      return res.status(404).json({ msg: "User Sudah Ada" });
    }

    try {
      await Users.create({
        name: nama,
        username: username,
        password: password,
        role: role,
        dept_limit: deptlimit,
        telp: telp,
        email: email,
        image: fileName,
        url: url,
        active: 0,
        filename: fileName,
        filesize: fileSize,
        ext: ext,
        kdkanwil: kdkanwil,
        kdkppn: kdkppn,
        verified: "FALSE",
      });
      res.status(201).json({ msg: "User Berhasil Disimpan" });
    } catch (error) {
      console.log(error.message);
    }
  });
};
export const ubahUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan" });

  let fileName = user.filename; // Tetapkan fileName ke gambar yang ada sebagai nilai default.

  if (req.files !== null) {
    upload.single("file")(req, res, (err) => {
      if (err) {
        return res.status(422).json({ msg: "Invalid Images" });
      }

      const file = req.file;
      if (!file || !file.size) {
        return res.status(422).json({ msg: "Invalid Images" });
      }

      const fileSize = file.size;
      const ext = path.extname(file.originalname);
      fileName = `${file.filename}${ext}`;
      const allowedTypes = [".png", ".jpg", ".jpeg"];

      if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid Images" });
      }
      if (fileSize > 1000000) {
        return res.status(422).json({ msg: "Image must be less than 1 MB" });
      }

      const filepath = `./public/images/${user.filename}`;
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }

      fs.rename(file.path, `./public/images/${fileName}`, (err) => {
        if (err) {
          return res.status(500).json({ msg: err.message });
        }

        const name = req.body.name;
        const password = req.body.password;
        const role = req.body.role;
        const deptlimit = req.body.deptlimit;
        const telp = req.body.telp;
        const email = req.body.email;
        const kdkanwil = req.body.kdkanwil;
        const kdkppn = req.body.kdkppn;
        const active = req.body.active;

        const url = fileName
          ? `${req.protocol}://${req.get("host")}/images/${fileName}`
          : "";

        Users.update(
          {
            name: name,
            password: password,
            role: role,
            dept_limit: deptlimit,
            url: url,
            telp: telp,
            email: email,
            kdkanwil: kdkanwil,
            kdkppn: kdkppn,
            filename: fileName,
            active: active,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        )
          .then(() => {
            res.status(200).json({ msg: "User Updated Successfully" });
          })
          .catch((error) => {
            console.log(error.message);
            res.status(500).json({ msg: "Server Error" });
          });
      });
    });
  } else {
    const name = req.body.name;
    const password = req.body.password;
    const role = req.body.role;
    const deptlimit = req.body.deptlimit;
    const telp = req.body.telp;
    const email = req.body.email;
    const kdkanwil = req.body.kdkanwil;
    const kdkppn = req.body.kdkppn;
    const active = req.body.active;

    const url = fileName
      ? `${req.protocol}://${req.get("host")}/images/${fileName}`
      : "";

    Users.update(
      {
        name: name,
        password: password,
        role: role,
        dept_limit: deptlimit,
        url: url,
        telp: telp,
        email: email,
        kdkanwil: kdkanwil,
        kdkppn: kdkppn,
        filename: fileName,
        active: active,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
      .then(() => {
        res.status(200).json({ msg: "User Updated Successfully" });
      })
      .catch((error) => {
        console.log(error.message);
        res.status(500).json({ msg: "Server Error" });
      });
  }
};

export const hapusUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "No Data Found" });

  try {
    const filepath = `./public/images/${user.filename}`;
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await Users.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "User Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const ubahUserProfile = async (req, res) => {
  try {
    // Find the user by ID
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User Tidak Ditemukan" });
    }

    // Handle file upload
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ msg: "Berkas tidak ditemukan dalam permintaan" });
      }

      const file = req.file;

      if (!file) {
        return res.status(400).json({ msg: "File tidak ditemukan" });
      }

      const fileSize = file.size;
      const ext = path.extname(file.originalname);
      const fileName = file.filename;
      const allowedTypes = [".png", ".jpg", ".jpeg"];

      if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid Images" });
      }

      if (fileSize > 1000000) {
        return res.status(422).json({ msg: "Image must be less than 1 MB" });
      }

      // Delete old file if exists
      const oldFilepath = `./public/images/${user.filename}`;
      if (fs.existsSync(oldFilepath)) {
        fs.unlinkSync(oldFilepath);
      }

      // Rename file to its new path
      fs.rename(file.path, `./public/images/${fileName}`, async (err) => {
        if (err) {
          return res.status(500).json({ msg: err.message });
        }

        // Check for duplicate phone number
        const cekDobelTelp = await Users.findOne({
          where: {
            telp: req.body.telp,
          },
        });

        if (cekDobelTelp) {
          return res.status(404).json({ msg: "Nomor telepon sudah digunakan" });
        }

        // Prepare file URL
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

        // Update user profile
        await Users.update(
          {
            name: req.body.name,
            url: fileName ? url : "",
            telp: req.body.telp,
            email: req.body.email,
            filename: fileName,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );

        return res
          .status(200)
          .json({ msg: "User Profile Updated Successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

export const ubahPassword = async (req, res) => {
  const user = await Users.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan" });

  const password = req.body.password;
  try {
    await Users.update(
      {
        password: password,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "User Password Updated Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};
export const simpanquery = async (req, res) => {
  const name = req.body.name;
  const tipe = req.body.tipe;
  const nama = req.body.nama;
  const query = req.body.query;
  const thang = req.body.thang;

  const user = await Users.findOne({
    where: {
      name: name,
    },
  });

  try {
    const uppercaseQuery = query.toUpperCase();
    await DataQuery.create({
      jenis: tipe,
      nama: nama,
      thang: thang,
      username: user.username,
      query: uppercaseQuery,
    });
    res.status(200).json({ msg: "Query Saved Successfuly" });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      nm_menu: "SIMPAN_QUERY",
    });
  } catch (error) {
    console.log(error.message);
  }
};
export const hapusquery = async (req, res) => {
  try {
    const query = await DataQuery.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!query) return res.status(404).json({ msg: "No Data Found" });
  } catch (error) {
    console.log(error.message);
  }
  try {
    await DataQuery.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Query Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserbyId = async (req, res) => {
  try {
    const data = await Users.findOne({
      attributes: [
        "id",

        "name",
        "username",
        "role",
        "kdkanwil",
        "kdkppn",
        "kdlokasi",
        "active",
        "email",
        "orderdata",
        "url",
        "telp",
        "dept_limit",
        "verified",
        "pin",
      ],
      where: {
        id: req.query.id,
      },
      include: [
        {
          model: User_log, // Gunakan nama model yang benar (User_log)
          required: false, // Gunakan INNER JOIN  order: [[Sequelize.literal('date_login'), 'DESC']], // Mengurutkan berdasarkan date_login secara descending
          order: [[Sequelize.literal("date_login"), "DESC"]], // Mengurutkan berdasarkan date_login secara descending
          limit: 1, // Mengambil satu data terakhir
        },
      ],
    });

    if (!data) {
      return res.status(404).json({ msg: "No Data Found" });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
export const Aktifasi = async (req, res) => {
  const { username, status } = req.query;
  if (status !== "0" && status !== "1") {
    return res.status(400).json({ msg: "Status tidak valid" });
  }
  const user = await Users.findOne({
    where: {
      username: username,
    },
  });

  if (!user) {
    return res.status(404).json({ msg: "User Tidak Ditemukan" });
  }

  try {
    await Users.update(
      {
        active: status === "1" ? "0" : "1",
      },
      {
        where: {
          username: username,
        },
      }
    );
    res.status(200).json({ msg: "User Updated Successfuly" });
  } catch (error) {
    return res.status(404).json({ msg: error });
  }
};

// OAuth Registration - tidak memerlukan token authentication
export const simpanUserOAuth = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(422).json({ msg: "Invalid Images" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No File Uploaded" });
    }

    const nama = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;
    const deptlimit = req.body.deptlimit;
    const telp = req.body.telp || "";
    const email = req.body.email;
    const nip = req.body.nip || "";
    const kdkanwil = req.body.kdkanwil || "";
    const kdkppn = req.body.kdkppn || "";
    const oauth_provider = req.body.oauth_provider || "";

    const file = req.file;
    const fileSize = file.size;
    const ext = path.extname(file.originalname);
    const fileName = file.filename;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: "Invalid Images" });
    }
    if (fileSize > 1000000) {
      return res.status(422).json({ msg: "Image must be less than 1 MB" });
    }

    // Cek apakah user sudah ada berdasarkan username, email, atau NIP
    const cekuser = await Users.findOne({
      where: {
        [Sequelize.Op.or]: [{ username }, { email }, ...(nip ? [{ nip }] : [])],
      },
    });

    if (cekuser) {
      return res.status(404).json({
        msg: "User dengan Username/Email/NIP tersebut sudah terdaftar",
      });
    }

    try {
      await Users.create({
        name: nama,
        username: username,
        password: password,
        role: 2,
        dept_limit: deptlimit,
        telp: telp,
        email: email,
        nip: nip,
        image: fileName,
        url: url,
        active: 0, // Langsung aktif untuk OAuth user
        filename: fileName,
        filesize: fileSize,
        ext: ext,
        kdkanwil: kdkanwil,
        kdkppn: kdkppn,
        verified: "TRUE", // Langsung verified untuk OAuth user
        oauth_provider: oauth_provider,
      });
      res.status(201).json({ msg: "User OAuth Berhasil Disimpan" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Gagal menyimpan user" });
    }
  });
};

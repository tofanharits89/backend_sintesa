import Notifikasi_Model from "../../models/notifikasi/notifikasiModel.js";
import User_Model from "../../models/UserModel.js";
import ioServer from "../../index.js";
import multer from "multer";
import path from "path";

export const simpanNotifikasi = async (req, res) => {
  const { destination, content, pinned, username, title, messageType, sendAs } =
    req.body;

  if (
    !destination ||
    !content ||
    !username ||
    !title ||
    !messageType ||
    !sendAs
  ) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }
  let userList;
  try {
    if (destination === "00") {
      userList = await User_Model.findAll();
    } else if (destination.includes("@") || destination.length > 2) {
      // Jika destination adalah username spesifik
      userList = await User_Model.findAll({
        where: { username: destination },
      });
    } else {
      // Jika destination adalah role
      userList = await User_Model.findAll({
        where: { role: destination },
      });
    }
    //console.log(userList);
    const notifications = userList.map(async (user) => {
      try {
        const newNotifikasi = await Notifikasi_Model.create({
          judul: title,
          tujuan: user.username,
          dari: username,
          isi: content,
          pinned: pinned ? "true" : "false",
          status: "false",
          tipe: messageType,
          tipe_notif: sendAs,
        });

        return newNotifikasi;
      } catch (error) {
        console.error("Error creating notification:", error);
        return null;
      }
    });

    const savedNotifications = await Promise.all(notifications);

    const successfulNotifications = savedNotifications.filter(
      (notification) => notification !== null
    );
    ioServer.emit("new-notification", savedNotifications);
    res.status(201).json(successfulNotifications);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const ubahStatus = async (req, res) => {
  const { id } = req.params;

  try {
    await Notifikasi_Model.update({ status: "true" }, { where: { id: id } });

    res.status(200).json({
      success: true,
      message: "Notification status updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Kritik"); // Tentukan direktori penyimpanan file
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`); // Beri nama file dengan timestamp
  },
});

const upload = multer({ storage });

export const sendBug = async (req, res) => {
  const { kategori } = req.body;
  if (kategori === "saran") {
    const { destination, kritik, dari, nama, pinned } = req.body;
    console.log(req.body);
    if (!destination || !dari || !kritik) {
      return res.status(400).json({ error: "Semua field harus diisi" });
    }
    let userList;
    try {
      userList = await User_Model.findAll({
        where: {
          role: "X",
        },
      });

      const notifications = userList.map(async (user) => {
        try {
          const newNotifikasi = await Notifikasi_Model.create({
            judul: "Pesan baru dari " + nama,
            tujuan: user.username,
            dari: dari,
            isi: kritik,
            pinned: pinned ? "true" : "false",
            status: "false",
            tipe: "pesan",
            tipe_notif: "pesan",
          });

          return newNotifikasi;
        } catch (error) {
          console.error("Error creating notification:", error);
          return null;
        }
      });

      const savedNotifications = await Promise.all(notifications);

      const successfulNotifications = savedNotifications.filter(
        (notification) => notification !== null
      );
      ioServer.emit("new-notification", savedNotifications);
      res.status(201).json(successfulNotifications);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    upload.single("file")(req, res, async (err) => {
      const { destination, kritik, dari, nama, pinned, jenisKritik } = req.body;
      console.log(req.body);
      if (err) {
        return res.status(422).json({ msg: "Invalid Image" });
      }

      if (req.file === null) {
        return res.status(400).json({ msg: "No File Uploaded" });
      }

      // Check if req.file is defined before accessing its properties
      if (req.file && req.file.size) {
        const fileSize = req.file.size;
        const ext = path.extname(req.file.originalname);
        const fileName = req.file.filename;
        const url = `${req.protocol}://${req.get("host")}/Kritik/${fileName}`;
        const allowedType = [".jpg", ".png", ".jpeg"];

        if (!allowedType.includes(ext.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Image" });
        }
        if (fileSize > 10000000) {
          return res.status(422).json({ msg: "File must be less than 10 MB" });
        }

        let userList;
        try {
          userList = await User_Model.findAll({
            where: {
              role: "X",
            },
          });

          const notifications = userList.map(async (user) => {
            try {
              const newNotifikasi = await Notifikasi_Model.create({
                judul: "Pesan baru dari " + nama,
                tujuan: user.username,
                dari: dari,
                isi: kritik,
                pinned: pinned ? "true" : "false",
                status: "false",
                tipe: "pesan",
                tipe_notif: "pesan",
                filename: url,
                jeniskritik: jenisKritik,
              });

              return newNotifikasi;
            } catch (error) {
              console.error("Error creating notification:", error);
              return null;
            }
          });

          const savedNotifications = await Promise.all(notifications);

          const successfulNotifications = savedNotifications.filter(
            (notification) => notification !== null
          );
          ioServer.emit("new-notification", savedNotifications);
          res.status(201).json(successfulNotifications);
        } catch (error) {
          console.error("Error creating notification:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      } else {
        return res.status(400).json({ msg: "File is missing or invalid" });
      }
    });
  }
};

export const ubahStatusOnline = async (req, res) => {
  const { username, isConnected } = req.params;

  try {
    await User_Model.update(
      { online: isConnected },
      { where: { username: username } }
    );
    res.status(200).json({
      success: true,
      message: "updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getNotifikasiById = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notifikasi_Model.findByPk(id);
    if (!notif) {
      return res.status(404).json({ error: "Notifikasi tidak ditemukan" });
    }
    res.json(notif);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import { Sequelize } from "sequelize";
import fs from "fs";

let db;
try {
  db = new Sequelize("data_omspan", "root", "dabantek2018", {
    host: "10.216.208.137",
    port: "3352",
    dialect: "mysql",
    logging: (log) => {
      fs.appendFile("logs/sintesa.log", log + "\n", (err) => {
        if (err) {
          console.error("Gagal menulis log ke file:", err);
        }
      });
    },
    dialectOptions: {
      connectTimeout: 60000, // Atur timeout koneksi ke 60 detik (opsional, sesuaikan sesuai kebutuhan)
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
  //ioServer.emit("running_querys", "koneksi db monev [status:berhasil]");
} catch (error) {
  if (error.name === "SequelizeConnectionRefusedError") {
    console.error(
      "Error: Connection refused. Make sure your database server is running."
    );
  } else if (error.name === "SequelizeHostNotFoundError") {
    console.error(
      "Error: Host not found. Make sure your database host is correct."
    );
  } else if (
    error.name === "SequelizeConnectionError" &&
    error.parent.code === "ETIMEDOUT"
  ) {
    console.error("Error: Operation timeout occurred. Handling the error...");
    // Tambahkan logika atau penanganan khusus untuk error koneksi timeout di sini
  } else {
    console.error("Error connecting to the database:", error);
    // Tambahkan penanganan untuk error lainnya di sini sesuai kebutuhan aplikasi Anda
  }
}

export default db;

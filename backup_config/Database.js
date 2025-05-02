import { Sequelize } from "sequelize";
import ioServer from "../index.js";
import fs from "fs";

const maxRetries = 5; // Maksimal percobaan koneksi ulang
let retries = 0;
const retryDelay = 5000; // Delay antara percobaan koneksi ulang (dalam ms)

const connectToDatabase = async () => {
  let db;
  try {
    db = new Sequelize("v3", "root", "dabantek2018", {
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

    await db.authenticate();
    console.log("Database Connected...");
  } catch (error) {
    if (error.name === "SequelizeConnectionRefusedError") {
      console.error("Error: Connection refused. Make sure your database server is running.");
    } else if (error.name === "SequelizeHostNotFoundError") {
      console.error("Error: Host not found. Make sure your database host is correct.");
    } else if (error.name === "SequelizeConnectionError" && error.parent.code === "ETIMEDOUT") {
      console.error("Error: Operation timeout occurred. Handling the error...");
      // Tambahkan logika atau penanganan khusus untuk error koneksi timeout di sini
    } else {
      console.error("Error connecting to the database:", error);
      // Tambahkan penanganan untuk error lainnya di sini sesuai kebutuhan aplikasi Anda
    }

    if (retries < maxRetries) {
      retries++;
      console.log(`Retrying connection (${retries}/${maxRetries})...`);
      setTimeout(connectToDatabase, retryDelay);
    } else {
      console.error("Max retries reached. Continuing without database connection.");
    }
  }
  return db;
};

const db = await connectToDatabase();

export default db;

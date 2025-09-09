import { Sequelize } from "sequelize";
import fs from "fs";

const dbName = "laporan_2023";
const dbUser = "root";
const dbPassword = "ktsjkt2010!";
const dbHost = "localhost";
const dbPort = "3306";

const formatDate = (date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

let db;
try {
  db = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
    logging: false,
    // logging: (log) => {
    //   const logMessage = `[${formatDate(new Date())}] [Database: ${dbName}] [Host: ${dbHost}] [Port: ${dbPort}] ${log}`;
    //   fs.appendFile("logs/sintesa.log", logMessage + "\n", (err) => {
    //     if (err) {
    //       console.error("Gagal menulis log ke file:", err);
    //     }
    //   });
    // },
    dialectOptions: {
      connectTimeout: 60000, // Atur timeout koneksi ke 60 detik (opsional, sesuaikan sesuai kebutuhan)
    },
    pool: {
      max: 4,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  });

  // Testing koneksi saat inisialisasi
  db.authenticate()
    .then(() => {
      console.log(
        `[${formatDate(new Date())}] Koneksi ke database ${dbName} berhasil.`
      );
    })
    .catch((error) => {
      const errorMessage = {
        timestamp: formatDate(new Date()),
        database: dbName,
        host: dbHost,
        port: dbPort,
        error: error.message,
      };
      if (error.name === "SequelizeConnectionRefusedError") {
        console.error({
          ...errorMessage,
          message:
            "Error: Connection refused. Make sure your database server is running.",
        });
      } else if (error.name === "SequelizeHostNotFoundError") {
        console.error({
          ...errorMessage,
          message:
            "Error: Host not found. Make sure your database host is correct.",
        });
      } else if (error.name === "SequelizeConnectionAcquireTimeoutError") {
        console.error({
          ...errorMessage,
          message:
            "Error: Connection acquire timeout occurred. Handling the error...",
        });
      } else if (
        error.name === "SequelizeConnectionError" &&
        error.parent.code === "ETIMEDOUT"
      ) {
        console.error({
          ...errorMessage,
          message: "Error: Operation timeout occurred. Handling the error...",
        });
      } else {
        console.error({
          ...errorMessage,
          message: "Error connecting to the database",
        });
      }
      // Tambahkan logika atau penanganan khusus untuk error koneksi timeout di sini
    });
} catch (error) {
  const errorMessage = {
    timestamp: formatDate(new Date()),
    database: dbName,
    host: dbHost,
    port: dbPort,
    error: error.message,
  };
  console.error({
    ...errorMessage,
    message: "Unhandled error occurred during database initialization",
  });
}

export default db;

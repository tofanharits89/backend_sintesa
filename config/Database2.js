import { Sequelize } from "sequelize";

// Konfigurasi database
const dbName = "monev2023";
const dbUser = "root";
const dbPassword = "dabantek2018";
const dbHost = "10.216.208.137";
const dbPort = "3352";

// Format waktu (opsional, dipakai untuk error log)
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

// Inisialisasi Sequelize
const db = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: false, // Tidak ada logging
  dialectOptions: {
    connectTimeout: 60000, // Timeout koneksi awal (60 detik)
  },
  pool: {
    max: 4,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Tes koneksi saat startup
const testConnection = async () => {
  try {
    await db.authenticate();
  } catch (error) {
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
        message: "Connection refused. Periksa apakah MySQL sedang berjalan.",
      });
    } else if (error.name === "SequelizeHostNotFoundError") {
      console.error({
        ...errorMessage,
        message: "Host tidak ditemukan. Periksa IP/hostname database.",
      });
    } else if (error.name === "SequelizeConnectionAcquireTimeoutError") {
      console.error({
        ...errorMessage,
        message: "Acquire timeout. Mungkin pool penuh atau MySQL lambat.",
      });
    } else if (
      error.name === "SequelizeConnectionError" &&
      error.parent?.code === "ETIMEDOUT"
    ) {
      console.error({
        ...errorMessage,
        message: "Operation timeout. Koneksi terlalu lama.",
      });
    } else {
      console.error({
        ...errorMessage,
        message: "Gagal konek ke database.",
      });
    }
  }
};

testConnection();

export default db;

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbV3 = new Sequelize("v3", process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 25,
    min: 5,
    acquire: 60000,
    idle: 30000,
    evict: 1000,
  },
  dialectOptions: {
    connectTimeout: 60000,
    charset: "utf8mb4",
  },
  retry: {
    match: [
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ECONNREFUSED/,
      /TIMEOUT/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
    ],
    max: 3,
  },
});

export default dbV3;

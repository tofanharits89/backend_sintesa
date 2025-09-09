// config/NEXTDatabaseSingle.js

import { Sequelize } from "sequelize";
import fs from "fs";

const dbName = "monev2025";
const dbUser = "root";
const dbPassword = "ktsjkt2010!";
const dbHost = "localhost";
const dbPort = "3306";

// Simple date formatter for logs
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

let NEXTDatabaseSingle;
try {
  NEXTDatabaseSingle = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
    // File-based SQL logging for analysis
    logging: (msg) => {
      const logMessage = `[${formatDate(new Date())}] [SQL] ${msg}`;
      const logDir = "logs";
      const logFile = `${logDir}/sintesa.log`;
      // Ensure the logs directory exists
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      fs.appendFile(logFile, logMessage + "\n", (err) => {
        if (err) {
          console.error("Failed to write SQL log to file:", err);
        }
      });
    },
    dialectOptions: {
      connectTimeout: 60000, // 1 minute connection timeout
      multipleStatements: false,
      charset: "utf8mb4",
      timezone: "+07:00",
    },
    pool: {
      max: 4, // Increased pool size for higher concurrency
      min: 0,
      acquire: 60000,
      idle: 10000,
      evict: 5000,
      handleDisconnects: true,
    },
    define: {
      timestamps: false,
      freezeTableName: true,
      underscored: false,
      paranoid: false,
    },
    benchmark: false, // No need for query timing
    retry: { max: 1 }, // Allow 1 retry for transient errors
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  });

  // Test connection immediately (optional)
  NEXTDatabaseSingle.authenticate()
    .then(() => {
      console.log(
        `✅ [${formatDate(
          new Date()
        )}] NEXT Single Database connection successful to ${dbName}`
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
        error.parent &&
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
      // Add custom logic for connection timeout errors here if needed
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

export default NEXTDatabaseSingle;

import { Sequelize } from "sequelize";

let db;

try {
  db = new Sequelize("tkd", "root", "dabantek2018", {
    host: "10.216.208.137",
    port: "3352",
    dialect: "mysql",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} catch (error) {
  console.error("Error connecting to the database:", error);
}

export default db;

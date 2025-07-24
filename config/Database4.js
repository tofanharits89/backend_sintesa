import { Sequelize } from "sequelize";

const db = new Sequelize("dbref", "root", "dabantek2018", {
  host: "10.216.208.137",
  port: "3352",
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    connectTimeout: 60000,
  },
  pool: {
    max: 4,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});

export default db;

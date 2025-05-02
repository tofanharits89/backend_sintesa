import db from "../../config/Database5.js";
import Sequelize from "sequelize";
import Log_menu from "../../models/Log_menu.js";
import { decryptData } from "../../middleware/Decrypt.js";

export const getDatabases = async (req, res) => {
  try {
    const sql = "SHOW DATABASES";
    const results = await db.query(sql, {
      type: Sequelize.QueryTypes.SHOWDATABASES,
    });

    const uniqueDatabases = Array.from(
      new Set(results.flat().map((item) => item.Database))
    );

    res.json(uniqueDatabases);
    // console.log(uniqueDatabases);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getTables = async (req, res) => {
  try {
    const { selectedDatabase } = req.params; // Ambil nilai selectedDatabase dari frontend
    console.log("log hasil" + selectedDatabase);
    const sql = `SHOW TABLES FROM ${selectedDatabase}`; // Gunakan selectedDatabase dalam SQL
    const results = await db.query(sql, {
      type: Sequelize.QueryTypes.SHOWTABLES,
    });

    res.json(results);
    //  console.log(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getColumnsOfTable = async (req, res) => {
  try {
    const { selectedDatabase, selectedTable } = req.params;
    console.log("Database: " + selectedDatabase);
    console.log("Table: " + selectedTable);

    const columnsInfo = await db.query(
      `SHOW COLUMNS FROM ${selectedDatabase}.${selectedTable}`
    );

    //console.log(columnsInfo); // Log the columnsInfo to inspect its structure
    const fieldValues = columnsInfo.flatMap((arr) =>
      arr.map((obj) => obj.Field)
    );
    const uniqueColumns = Array.from(new Set(fieldValues));
    res.json(uniqueColumns);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
export const Ref_Data_Mysql = async (req, res) => {
  const queryParams = req.query.queryParams;
  const database = req.query.db;
  const tabel = req.query.tabel;
  const where = req.query.where;

  const decryptedData = decryptData(queryParams).replace(/"/g, "");

  try {
    const total = await db.query(
      ` SELECT COUNT(*) AS TOTAL FROM (SELECT * FROM ${database}.${tabel} ${where} LIMIT 100000) AS temp_table`,

      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (total[0].TOTAL > 100000) {
      return res.status(400).json({
        error:
          "Data yang akan ditampilkan terlalu besar (maksimal 100.000 baris data)",
      });
    }

    const resultsQuery = `${decryptedData} `;

    try {
      const [results] = await Promise.all([
        db.query(resultsQuery, {
          type: Sequelize.QueryTypes.SELECT,
          // Tambahkan timeout di sini jika ingin menetapkannya untuk permintaan khusus
        }),
      ]);

      const clientIP =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;

      if (req.session.username !== "yacob" && req.session.username) {
        await Log_menu.create({
          ip: clientIP,
          username: req.query.user,
          nm_menu: `GENERATE { DB ${database} TABLE ${tabel}:  BY ${req.session.username} }`,
        });
      }
      res.json({
        total: total[0].TOTAL,
        result: results,
      });
    } catch (timeoutError) {
      console.error("Timeout error:", timeoutError);
      res.status(500).json({ error: "Koneksi ke database timeout" });
    }
  } catch (error) {
    console.error("Error in processing query:", error);
    const errorMessage = error.original
      ? error.original.sqlMessage
      : "Terjadi kesalahan dalam memproses permintaan.";
    res.status(500).json({ error: errorMessage });
  }
};

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

export const getKddeptList = async (req, res) => {
  const { role, kdkanwil, kdkppn } = req.query;
  try {
    let query = "";
    if (role === "pusat" || role === "superadmin") {
      query = `SELECT DISTINCT kddept, dept.nmdept FROM dbref.t_dept_2025 dept WHERE kddept <> 999 ORDER BY kddept ASC`;
      // query = `SELECT d.kddept, dept.nmdept FROM dbref.t_satker d LEFT JOIN dbref.t_dept_2025 dept ON d.kddept = dept.kddept GROUP BY d.kddept, dept.nmdept`;
    } else if (role === "kanwil" && kdkanwil) {
      query = `SELECT DISTINCT a.kddept, b.nmdept FROM dbref.t_satker_kppn_2025 a LEFT JOIN dbref.t_dept_2025 b ON a.kddept = b.kddept WHERE a.kdkanwil = ? AND a.kddept <> 999  AND b.nmdept IS NOT NULL GROUP BY a.kddept, b.nmdept ORDER BY a.kddept ASC`;
      // query = `SELECT a.kddept, b.nmdept FROM dbref.t_satker_kppn_2025 a LEFT JOIN dbref.t_dept_2025 b ON a.kddept = b.kddept WHERE a.kdkanwil = ? GROUP BY kddept,nmdept`;
      // query = `SELECT d.kddept, dept.nmdept FROM dbref.t_satker d LEFT JOIN dbref2025.t_kppn k ON d.kdkppn = k.kdkppn LEFT JOIN dbref.t_dept_2025 dept ON d.kddept = dept.kddept WHERE k.kdkanwil = ? GROUP BY d.kddept, dept.nmdept`;
    } else if (role === "kppn" && kdkppn) {
      query = `SELECT DISTINCT a.kddept, b.nmdept FROM dbref.t_satker_kppn_2025 a LEFT JOIN dbref.t_dept_2025 b ON a.kddept = b.kddept WHERE a.kdkppn = ? AND a.kddept <> 999  AND b.nmdept IS NOT NULL GROUP BY a.kddept, b.nmdept ORDER BY a.kddept ASC`;
      // query = `SELECT d.kddept, dept.nmdept FROM dbref.t_satker d LEFT JOIN dbref2025.t_kppn k ON d.kdkppn = k.kdkppn LEFT JOIN dbref.t_dept_2025 dept ON d.kddept = dept.kddept WHERE k.kdkppn = ? GROUP BY d.kddept, dept.nmdept`;
    } else {
      return res.status(400).json({ error: "Parameter tidak lengkap" });
    }
    const param = role === "kanwil" ? kdkanwil : kdkppn;
    const results = await db.query(query, {
      replacements: param ? [param] : [],
      type: Sequelize.QueryTypes.SELECT,
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

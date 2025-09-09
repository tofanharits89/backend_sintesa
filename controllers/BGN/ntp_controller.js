import ntpmodel from '../../models/mbg/ntpmodel.js';
import db from '../../config/Database8.js';
import { decryptData } from '../../middleware/Decrypt.js';
import Sequelize from "sequelize";

export const getFilteredNtpEncrypted = async (req, res) => {
  // Ambil dan dekripsi parameter queryParams
  const queryParams = req.query.queryParams;
  console.log("[NTP] Incoming queryParams:", queryParams);
  if (!queryParams) {
    return res.status(400).json({ message: "Missing encrypted queryParams" });
  }
  let decryptedQuery;
  try {
    decryptedQuery = decryptData(queryParams);
    // Hapus tanda kutip ganda di awal/akhir jika ada
    if (decryptedQuery.startsWith('"') && decryptedQuery.endsWith('"')) {
      decryptedQuery = decryptedQuery.slice(1, -1);
    }
    decryptedQuery = decryptedQuery.trim();
    console.log("[NTP] Decrypted query:", decryptedQuery);
    // decryptedQuery diharapkan dalam bentuk query SQL
  } catch (error) {
    console.error("[NTP] Failed to decrypt queryParams:", error);
    return res.status(400).json({ message: "Failed to decrypt queryParams" });
  }

  // Pagination (opsional)
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  try {
    // Query utama dengan LIMIT & OFFSET
    const resultsQuery = `${decryptedQuery} LIMIT ${limit} OFFSET ${offset}`;
    const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${decryptedQuery}) AS totalCountSubquery`;
    console.log("[NTP] Executing resultsQuery:", resultsQuery);
    console.log("[NTP] Executing totalCountQuery:", totalCountQuery);

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT
      }),
    ]);
    const totalCount = totalCountResult[0].totalCount;
    res.json({
      result: results,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
    });
  } catch (error) {
    console.error("[NTP] Error executing query:", error);
    res.status(500).json({
      error: error.original?.sqlMessage || error.message,
    });
  }
};

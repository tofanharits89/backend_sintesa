import komoditasmodel from '../../models/mbg/komoditasmodel.js';
import db from '../../config/Database8.js';
import { decryptData } from '../../middleware/Decrypt.js';
import Sequelize from "sequelize";

// Endpoint untuk query terenkripsi + pagination
export const getFilteredKomoditasEncrypted = async (req, res) => {
  const queryParams = req.query.queryParams;
  console.log("[KOMODITAS] Incoming queryParams:", queryParams);
  if (!queryParams) {
    return res.status(400).json({ message: "Missing encrypted queryParams" });
  }
  let decryptedQuery;
  try {
    decryptedQuery = decryptData(queryParams);
    // Hilangkan tanda kutip di awal/akhir jika ada
    if (decryptedQuery.startsWith('"') && decryptedQuery.endsWith('"')) {
      decryptedQuery = decryptedQuery.slice(1, -1);
    }
    decryptedQuery = decryptedQuery.trim();
    console.log("[KOMODITAS] Decrypted query:", decryptedQuery);
  } catch (error) {
    console.error("[KOMODITAS] Failed to decrypt queryParams:", error);
    return res.status(400).json({ message: "Failed to decrypt queryParams" });
  }

  // Pagination opsional
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  try {
    // Query utama + count
    const resultsQuery = `${decryptedQuery} LIMIT ${limit} OFFSET ${offset}`;
    const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${decryptedQuery}) AS totalCountSubquery`;
    console.log("[KOMODITAS] Executing resultsQuery:", resultsQuery);
    console.log("[KOMODITAS] Executing totalCountQuery:", totalCountQuery);

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
    console.error("[KOMODITAS] Error executing query:", error);
    res.status(500).json({
      error: error.original?.sqlMessage || error.message,
    });
  }
};

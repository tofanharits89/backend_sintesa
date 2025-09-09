import byPetugasProvModel from '../../models/mbg/petugasmodel.js';
import db from '../../config/Database8.js';
import { decryptData } from '../../middleware/Decrypt.js';
import Sequelize from "sequelize";

// Endpoint untuk query terenkripsi + pagination (by_petugas_prov)
export const getFilteredByPetugasProvEncrypted = async (req, res) => {
  const queryParams = req.query.queryParams;
  console.log("[BY_PETUGAS_PROV] Incoming queryParams:", queryParams);
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
    console.log("[BY_PETUGAS_PROV] Decrypted query:", decryptedQuery);
  } catch (error) {
    console.error("[BY_PETUGAS_PROV] Failed to decrypt queryParams:", error);
    return res.status(400).json({ message: "Failed to decrypt queryParams" });
  }

  // Pagination opsional
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  try {
    // Query utama + count
    const resultsQuery = decryptedQuery; // tanpa LIMIT/OFFSET
    const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${decryptedQuery}) AS totalCountSubquery`;
    console.log("[BY_PETUGAS_PROV] Executing resultsQuery:", resultsQuery);
    console.log("[BY_PETUGAS_PROV] Executing totalCountQuery:", totalCountQuery);

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT
      }),
    ]);
    const totalCount = totalCountResult[0].totalCount;
    console.log("[BY_PETUGAS_PROV] Query result:", results);
    res.json({
      result: results,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
    });
  } catch (error) {
    console.error("[BY_PETUGAS_PROV] Error executing query:", error);
    res.status(500).json({
      error: error.original?.sqlMessage || error.message,
    });
  }
};

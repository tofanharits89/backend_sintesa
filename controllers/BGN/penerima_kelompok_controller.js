import penerimaKelompokModel from '../../models/mbg/penerima_kelompok_model.js';
import db from '../../config/Database8.js';
import { decryptData } from '../../middleware/Decrypt.js';
import Sequelize from "sequelize";

// Get data with encrypted query parameters - Main function
export const getPenerimaKelompokEncrypted = async (req, res) => {
  const queryParams = req.query.queryParams;
  console.log("[PENERIMA_KELOMPOK] Incoming queryParams:", queryParams);
  
  if (!queryParams) {
    return res.status(400).json({ 
      status: "error",
      message: "Missing encrypted queryParams" 
    });
  }

  let decryptedQuery;
  try {
    decryptedQuery = decryptData(queryParams);
    // Hilangkan tanda kutip di awal/akhir jika ada
    if (decryptedQuery.startsWith('"') && decryptedQuery.endsWith('"')) {
      decryptedQuery = decryptedQuery.slice(1, -1);
    }
    decryptedQuery = decryptedQuery.trim();
    console.log("[PENERIMA_KELOMPOK] Decrypted query:", decryptedQuery);
  } catch (error) {
    console.error("[PENERIMA_KELOMPOK] Failed to decrypt queryParams:", error);
    return res.status(400).json({ 
      status: "error",
      message: "Failed to decrypt queryParams" 
    });
  }

  // Pagination opsional
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  try {
    // Cek apakah query sudah memiliki LIMIT clause
    const hasLimit = /\bLIMIT\s+\d+/i.test(decryptedQuery);
    
    // Query utama - hanya tambahkan pagination jika belum ada LIMIT
    const resultsQuery = hasLimit ? decryptedQuery : `${decryptedQuery} LIMIT ${limit} OFFSET ${offset}`;
    
    // Untuk totalCount, hilangkan LIMIT dari query asli jika ada
    const queryForCount = hasLimit ? decryptedQuery.replace(/\bLIMIT\s+\d+(\s+OFFSET\s+\d+)?/i, '').trim() : decryptedQuery;
    const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${queryForCount}) AS totalCountSubquery`;
    
    console.log("[PENERIMA_KELOMPOK] Executing resultsQuery:", resultsQuery);
    console.log("[PENERIMA_KELOMPOK] Executing totalCountQuery:", totalCountQuery);

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
    console.error("[PENERIMA_KELOMPOK] Error executing query:", error);
    res.status(500).json({
      error: error.original?.sqlMessage || error.message,
    });
  }
};
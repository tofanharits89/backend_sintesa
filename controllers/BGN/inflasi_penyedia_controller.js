import Inflasi_Penyedia_Model from "../../models/mbg/inflasi_penyedia_model.js";
import { decryptData } from "../../middleware/Decrypt.js";
import db from "../../config/Database8.js";
import { Sequelize } from "sequelize";

// GET - Mengambil semua data inflasi penyedia
export const getInflasiPenyedia = async (req, res) => {
    console.log("Request to get all inflasi penyedia data received", req.query);
  try {
    // Validasi parameter queryParams
    if (!req.query.queryParams) {
      return res.status(400).json({
        success: false,
        message: "Parameter queryParams diperlukan",
        error: "Missing queryParams parameter"
      });
    }

    // Decrypt query
    const decryptedQuery = decryptData(req.query.queryParams).replace(/"/g, "");
    console.log("Decrypted query:", decryptedQuery);

    // Validasi query tidak kosong
    if (!decryptedQuery || decryptedQuery.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Query tidak valid setelah decrypt",
        error: "Invalid decrypted query"
      });
    }

    // Execute raw query
    const [results] = await Promise.all([
      db.query(decryptedQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    res.json({
      success: true,
      message: "Data inflasi penyedia berhasil diambil",
      result: results,
      total: results.length
    });

  } catch (error) {
    console.error("Error getting inflasi penyedia data:", error);
    
    // Response error
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data inflasi penyedia",
      error: error.message
    });
  } finally {
    console.log("Finished processing request to get inflasi penyedia data");
  }
};

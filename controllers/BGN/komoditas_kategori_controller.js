import komoditas_kategori_model from '../../models/mbg/komoditas_kategori_model.js';
import { decryptData } from '../../middleware/Decrypt.js';

const getKomoditasKategori = async (req, res) => {
  try {
    const { queryParams } = req.query;
    
    if (!queryParams) {
      return res.status(400).json({
        status: "error",
        message: "Query parameters are required"      });
    }

    let decryptedQuery;
    try {
      decryptedQuery = decryptData(queryParams);
      // Hilangkan tanda kutip di awal/akhir jika ada
      if (decryptedQuery.startsWith('"') && decryptedQuery.endsWith('"')) {
        decryptedQuery = decryptedQuery.slice(1, -1);
      }
      decryptedQuery = decryptedQuery.trim();
      console.log("[KOMODITAS_KATEGORI] Decrypted query:", decryptedQuery);
    } catch (error) {
      console.error("[KOMODITAS_KATEGORI] Failed to decrypt queryParams:", error);
      return res.status(400).json({
        status: "error",
        message: "Failed to decrypt query parameters"
      });
    }
    
    if (!decryptedQuery) {
      return res.status(400).json({
        status: "error",
        message: "Invalid encrypted query"
      });
    }

    // Execute query
    const [result] = await komoditas_kategori_model.sequelize.query(decryptedQuery);
    
    res.json({
      status: "success",
      result: result
    });

  } catch (error) {
    console.error('Error in getKomoditasKategori:', error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
};

export { getKomoditasKategori };

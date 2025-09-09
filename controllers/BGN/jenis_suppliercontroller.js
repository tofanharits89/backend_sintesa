import jenisSupplierModel from "../../models/mbg/jenis_suppliermodel.js";
import db from '../../config/Database8.js';
import { decryptData } from '../../middleware/Decrypt.js';

// Get supplier data with encrypted query support
export const getJenisSupplierEncrypted = async (req, res) => {
  const queryParams = req.query.queryParams;
  console.log("[JENIS_SUPPLIER] Incoming queryParams:", queryParams);
  
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
    console.log("[JENIS_SUPPLIER] Decrypted query:", decryptedQuery);
  } catch (error) {
    console.error("[JENIS_SUPPLIER] Failed to decrypt queryParams:", error);
    return res.status(400).json({ 
      status: "error",
      message: "Failed to decrypt query parameters" 
    });
  }

  try {
    const [results] = await db.query(decryptedQuery);
    console.log("[JENIS_SUPPLIER] Query results count:", results.length);
    
    res.status(200).json({
      status: "success",
      result: results,
      count: results.length
    });

  } catch (error) {
    console.error("[JENIS_SUPPLIER] Database query error:", error);
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

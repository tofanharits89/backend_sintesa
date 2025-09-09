import DataSubsidi from "../models/DataSubsidi.js";
import { Op } from "sequelize";
import Sequelize from "sequelize";
import db from "../config/Database9.js";
import { decryptData } from "../middleware/Decrypt.js";

// Whitelist kolom yang boleh difilter dari query string
const allowedFilters = new Set([
  "tahun",
  "kddept",
  "kdunit",
  "kdsatker",
  "kdprogram",
  "kdkegiatan",
  "kdoutput",
  "kdakun",
  "kdprov",
  "kdkabkota",
  "kdkec",
  "jns_bansos",
]);

export const getSubsidi = async (req, res) => {
  try {
    const { page = 0, limit = 50, sort = null, order = "ASC" } = req.query;
    const queryParams = req.query.queryParams;

    // If encrypted raw SQL provided, decrypt and execute it directly.
    if (queryParams && String(queryParams).trim() !== "") {
      try {
        const decrypted = decryptData(queryParams).replace(/"/g, "");
        // Decode URL-encoded SQL
        const sql = decodeURIComponent(String(decrypted).trim());
        // console.log("datasubsidi: executing full SQL:", sql);
        const results = await db.query(sql, {
          type: Sequelize.QueryTypes.SELECT,
        });
        // console.log("datasubsidi: query returned", results.length, "rows");
        // console.log(
        //   "datasubsidi: first few results:",
        //   JSON.stringify(results.slice(0, 3), null, 2)
        // );
        return res.json({
          result: results,
          data: results, // Also include in data field for compatibility
          total: results.length,
        });
      } catch (err) {
        console.error("Error executing decrypted SQL:", err);
        return res
          .status(500)
          .json({ error: "Failed to execute provided query." });
      }
    }

    const pageNum = Math.max(0, Number.isNaN(Number(page)) ? 0 : Number(page));
    const lim = Number.isNaN(Number(limit)) ? 50 : Math.max(1, Number(limit));
    const offset = pageNum * lim;

    // Build where clause dari query params yang di-whitelist
    const where = {};
    for (const [k, v] of Object.entries(req.query || {})) {
      if (
        allowedFilters.has(k) &&
        v !== undefined &&
        v !== null &&
        String(v).trim() !== ""
      ) {
        // simple equality filter; bisa dikembangkan jadi like / range dsb
        where[k] = v;
      }
    }

    // Build order if sort valid
    let orderArr = [];
    if (
      sort &&
      typeof sort === "string" &&
      Object.prototype.hasOwnProperty.call(
        DataSubsidi.rawAttributes || {},
        sort
      )
    ) {
      orderArr = [
        [sort, String(order).toUpperCase() === "DESC" ? "DESC" : "ASC"],
      ];
    }

    const result = await DataSubsidi.findAndCountAll({
      where,
      limit: lim,
      offset,
      order: orderArr,
      raw: true,
    });

    const total = result.count || 0;
    const totalPages = Math.ceil(total / lim);

    return res.json({
      data: result.rows,
      meta: {
        total,
        page: pageNum,
        limit: lim,
        totalPages,
      },
    });
  } catch (err) {
    console.error("getSubsidi error", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export default { getSubsidi };

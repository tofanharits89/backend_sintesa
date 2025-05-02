import Sequelize from "sequelize";
import db from "../../config/Database.js";

export const inquiryrkakl = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.page) || 100;

  try {
    const results = await db.query(
      queryParams + " ORDER BY id DESC  LIMIT " + limit,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      result: results,
      lastId: results.length ? results[results.length - 1].id : 0,
      hasMore: results.length >= limit,
    });
  } catch (error) {
    res.status(500).json({
      error: error.original.sqlMessage,
    });
  }
};

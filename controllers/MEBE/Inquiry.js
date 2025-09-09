import Sequelize from "sequelize";
import db from "../../config/Database.js";
import { decryptData } from "../../middleware/Decrypt.js";
import Log_menu from "../../models/Log_menu.js";
import db135 from "../../config/Database135.js";

export const inquiry = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  try {
    const resultsQuery = `
      ${queryParams}
      ORDER BY a.kddept, a.kdunit, a.kdkppn, a.kdsatker DESC
      LIMIT :limit OFFSET :offset
    `;

    const totalCountQuery = `
      SELECT COUNT(*) AS totalCount FROM (${queryParams}) AS totalCountSubquery
    `;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};
export const inquiryBelanja = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = `${decryptedData} ORDER BY a.kddept, a.kdunit, a.kdkppn, a.kdsatker DESC LIMIT :limit OFFSET :offset
    `;

    const totalCountQuery = `SELECT COUNT(*) AS totalCount,SUM(PAGU_DIPA) AS totalPagu,SUM(REALISASI) AS totalRealisasi,SUM(BLOKIR) AS totalBlokir
FROM (${decryptedData}) AS totalCountSubquery
    `;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;
    const totalPagu = totalCountResult[0].totalPagu;
    const totalRealisasi = totalCountResult[0].totalRealisasi;
    const totalBlokir = totalCountResult[0].totalBlokir;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
      totalPagu: totalPagu,
      totalRealisasi: totalRealisasi,
      totalBlokir: totalBlokir,
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "INQUIRY_BELANJA",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};
export const randomQueryTematik = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = `
  ${decryptedData}
  ORDER BY a.kddept, a.kdunit, a.kdkppn, a.kdsatker DESC
  LIMIT ${limit} OFFSET ${offset}
`;

    const totalCountQuery = `
      SELECT COUNT(*) AS totalCount,SUM(PAGU) AS totalPagu,SUM(JAN) AS TOTAL_JAN,SUM(FEB) AS TOTAL_FEB,SUM(MAR) AS TOTAL_MAR,SUM(APR) AS TOTAL_APR,SUM(MEI) AS TOTAL_MEI,SUM(JUN) AS TOTAL_JUN,SUM(JUL) AS TOTAL_JUL,SUM(AGS) AS TOTAL_AGS,SUM(SEP) AS TOTAL_SEP,SUM(OKT) AS TOTAL_OKT,SUM(NOV) AS TOTAL_NOV,SUM(DES) AS TOTAL_DES,SUM(BLOKIR) AS totalBlokir FROM (${decryptedData}) AS totalCountSubquery
    `;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;
    const totalPagu = totalCountResult[0].totalPagu;
    const totalJan = totalCountResult[0].TOTAL_JAN;
    const totalFeb = totalCountResult[0].TOTAL_FEB;
    const totalMar = totalCountResult[0].TOTAL_MAR;
    const totalApr = totalCountResult[0].TOTAL_APR;
    const totalMei = totalCountResult[0].TOTAL_MEI;
    const totalJun = totalCountResult[0].TOTAL_JUN;
    const totalJul = totalCountResult[0].TOTAL_JUL;
    const totalAgs = totalCountResult[0].TOTAL_AGS;
    const totalSep = totalCountResult[0].TOTAL_SEP;
    const totalOkt = totalCountResult[0].TOTAL_OKT;
    const totalNov = totalCountResult[0].TOTAL_NOV;
    const totalDes = totalCountResult[0].TOTAL_DES;

    const totalBlokir = totalCountResult[0].totalBlokir;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
      totalPagu: totalPagu,
      totalJan: totalJan,
      totalFeb: totalFeb,
      totalMar: totalMar,
      totalApr: totalApr,
      totalMei: totalMei,
      totalJun: totalJun,
      totalJul: totalJul,
      totalAgs: totalAgs,
      totalSep: totalSep,
      totalOkt: totalOkt,
      totalNov: totalNov,
      totalDes: totalDes,
      totalBlokir: totalBlokir,
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "TEMATIK",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const randomQueryTematikApbd = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  // console.log("Decrypted Data:", decryptedData);

  try {
    //     const resultsQuery = `
    //   ${decryptedData}
    //   ORDER BY a.kdprov, a.kdkabkota, a.kdkppn, a.kdsatker DESC

    //   LIMIT ${limit} OFFSET ${offset}
    // `;
    const resultsQuery = `
  ${decryptedData}
  ORDER BY a.kdprov DESC
    LIMIT ${limit} OFFSET ${offset}
`;
    // let totalCountQuery;

    const totalCountQuery = `
      SELECT COUNT(*) AS totalCount,SUM(JAN) AS TOTAL_JAN,SUM(FEB) AS TOTAL_FEB,SUM(MAR) AS TOTAL_MAR,SUM(APR) AS TOTAL_APR,SUM(MEI) AS TOTAL_MEI,SUM(JUN) AS TOTAL_JUN,SUM(JUL) AS TOTAL_JUL,SUM(AGS) AS TOTAL_AGS,SUM(SEP) AS TOTAL_SEP,SUM(OKT) AS TOTAL_OKT,SUM(NOV) AS TOTAL_NOV,SUM(DES) AS TOTAL_DES FROM (${decryptedData}) AS totalCountSubquery
    `;

    // console.log("Results Query:", resultsQuery);

    // const totalCountQuery = `
    //   SELECT COUNT(*) AS totalCount,COALESCE(SUM(periode1),0) AS TOTAL_JAN, COALESCE(SUM(periode2),0) AS TOTAL_FEB, COALESCE(SUM(periode3),0) AS TOTAL_MAR,COALESCE(SUM(periode4),0) AS TOTAL_APR,COALESCE(SUM(periode5),0) AS TOTAL_MEI,COALESCE(SUM(periode6),0) AS TOTAL_JUN,COALESCE(SUM(periode7),0) AS TOTAL_JUL,COALESCE(SUM(periode8),0) AS TOTAL_AGS,COALESCE(SUM(periode9),0) AS TOTAL_SEP,COALESCE(SUM(periode10),0) AS TOTAL_OKT,COALESCE(SUM(periode11),0) AS TOTAL_NOV,COALESCE(SUM(periode12),0) AS TOTAL_DES FROM (${decryptedData}) AS totalCountSubquery
    // `;

    // console.log("Total Count Query:", totalCountQuery);

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;
    const totalJan = totalCountResult[0].TOTAL_JAN;
    const totalFeb = totalCountResult[0].TOTAL_FEB;
    const totalMar = totalCountResult[0].TOTAL_MAR;
    const totalApr = totalCountResult[0].TOTAL_APR;
    const totalMei = totalCountResult[0].TOTAL_MEI;
    const totalJun = totalCountResult[0].TOTAL_JUN;
    const totalJul = totalCountResult[0].TOTAL_JUL;
    const totalAgs = totalCountResult[0].TOTAL_AGS;
    const totalSep = totalCountResult[0].TOTAL_SEP;
    const totalOkt = totalCountResult[0].TOTAL_OKT;
    const totalNov = totalCountResult[0].TOTAL_NOV;
    const totalDes = totalCountResult[0].TOTAL_DES;

    const totalBlokir = totalCountResult[0].totalBlokir;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
      totalJan: totalJan,
      totalFeb: totalFeb,
      totalMar: totalMar,
      totalApr: totalApr,
      totalMei: totalMei,
      totalJun: totalJun,
      totalJul: totalJul,
      totalAgs: totalAgs,
      totalSep: totalSep,
      totalOkt: totalOkt,
      totalNov: totalNov,
      totalDes: totalDes,
      totalBlokir: totalBlokir,
    });

    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "TEMATIK_APBD",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const randomQueryTematikApbd2 = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  // console.log("Decrypted Data:", decryptedData);
  try {
    // Gunakan query khusus untuk pagu seperti yang diminta
    const resultsQuery = `
      SELECT a.kdprov, ROUND(SUM(a.pagu)/1, 0) AS PAGU
      FROM monev2025.a_pagu_bkpk_apbd_2025 a
      GROUP BY a.kdprov
      ORDER BY a.kdprov DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Jika decryptedData berbeda, gunakan ini sebagai alternatif
    // const resultsQuery = `
    //   ${decryptedData}
    //   ORDER BY a.kdprov DESC
    //   LIMIT ${limit} OFFSET ${offset}
    // `;

    const totalCountQuery = `
      SELECT COUNT(*) AS totalCount, SUM(PAGU) AS TOTAL_PAGU
      FROM (${resultsQuery}) AS totalCountSubquery
    `;

    // console.log("Results Query:", resultsQuery);
    // console.log("Total Count Query:", totalCountQuery);

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;
    const totalPagu = totalCountResult[0].TOTAL_PAGU;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
      totalPagu: totalPagu,
    });

    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "TEMATIK_APBD",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const tgupdate = async (req, res) => {
  const thang = parseInt(req.query.thang);
  try {
    const result = await db.query(
      "SELECT tgupdate FROM monev" + thang + ".tgupdate;",
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    res.json(result);
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const inquirycsv = async (req, res) => {
  const queryParams = req.query.queryParams;

  try {
    const result = await db.query(queryParams, {
      type: Sequelize.QueryTypes.SELECT,
    });

    // Assuming result is an array of objects
    const formattedResult = result.map((row) => {
      const formatNumericColumn = (columnName) => {
        if (row[columnName] !== null && row[columnName] !== undefined) {
          row[columnName] = parseFloat(row[columnName]);
        }
      };

      const columnsToFormat = [
        "PAGU",
        "BLOKIR",
        "REALISASI",
        "PAGU_DIPA",
        "PAGU_APBN",
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MEI",
        "JUN",
        "JUL",
        "AGS",
        "SEP",
        "OKT",
        "NOV",
        "DES",
        "VOL",
        "RJAN",
        "PJAN",
        "RPJAN",
        "RFEB",
        "PFEB",
        "RPFEB",
        "RMAR",
        "PMAR",
        "RPMAR",
        "RAPR",
        "PAPR",
        "RPAPR",
        "RMEI",
        "PMEI",
        "RPMEI",
        "RJUN",
        "PJUN",
        "RPJUN",
        "RJUL",
        "PJUL",
        "RPJUL",
        "RAGS",
        "PAGS",
        "RPAGS",
        "RSEP",
        "PSEP",
        "RPSEP",
        "ROKT",
        "POKT",
        "RPOKT",
        "RNOV",
        "PNOV",
        "RPNOV",
        "RDES",
        "PDES",
        "RPDES",
        "PAGU_KONTRAK",
        "REALISASI_KONTRAK",
        "RUPIAH",
        "JML1",
        "REAL1",
        "JML2",
        "REAL2",
        "JML3",
        "REAL3",
        "JML4",
        "REAL4",
        "JML5",
        "REAL5",
        "JML6",
        "REAL6",
        "JML7",
        "REAL7",
        "JML8",
        "REAL8",
        "JML9",
        "REAL9",
        "JML10",
        "REAL10",
        "JML11",
        "REAL11",
        "JML12",
        "REAL12",
        "RENC",
        "RENC1",
        "REAL1",
        "RENC2",
        "REAL2",
        "RENC3",
        "REAL3",
        "RENC4",
        "REAL4",
        "RENC5",
        "REAL5",
        "RENC6",
        "REAL6",
        "RENC7",
        "REAL7",
        "RENC8",
        "REAL8",
        "RENC9",
        "REAL9",
        "RENC10",
        "REAL10",
        "RENC11",
        "REAL11",
        "RENC12",
        "REAL12",
        "VOLKEG",
        "HARGASAT",
        "JUMLAH",
        "INEFISIENSI",
      ];

      columnsToFormat.forEach((column) => formatNumericColumn(column));
      return row;
    });

    res.json(formattedResult);
  } catch (error) {
    console.error("Error:", error);
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};
export const inquirycsvtkd = async (req, res) => {
  const queryParams = req.query.queryParams;

  try {
    const result = await db135.query(queryParams, {
      type: Sequelize.QueryTypes.SELECT,
    });

    // Assuming result is an array of objects
    const formattedResult = result.map((row) => {
      const formatNumericColumn = (columnName) => {
        if (row[columnName] !== null && row[columnName] !== undefined) {
          row[columnName] = parseFloat(row[columnName]);
        }
      };

      const columnsToFormat = [
        "PAGU",
        "BLOKIR",
        "REALISASI",
        "PAGU_DIPA",
        "PAGU_APBN",
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MEI",
        "JUN",
        "JUL",
        "AGS",
        "SEP",
        "OKT",
        "NOV",
        "DES",
        "VOL",
        "RJAN",
        "PJAN",
        "RPJAN",
        "RFEB",
        "PFEB",
        "RPFEB",
        "RMAR",
        "PMAR",
        "RPMAR",
        "RAPR",
        "PAPR",
        "RPAPR",
        "RMEI",
        "PMEI",
        "RPMEI",
        "RJUN",
        "PJUN",
        "RPJUN",
        "RJUL",
        "PJUL",
        "RPJUL",
        "RAGS",
        "PAGS",
        "RPAGS",
        "RSEP",
        "PSEP",
        "RPSEP",
        "ROKT",
        "POKT",
        "RPOKT",
        "RNOV",
        "PNOV",
        "RPNOV",
        "RDES",
        "PDES",
        "RPDES",
        "PAGU_KONTRAK",
        "REALISASI_KONTRAK",
        "RUPIAH",
        "JML1",
        "REAL1",
        "JML2",
        "REAL2",
        "JML3",
        "REAL3",
        "JML4",
        "REAL4",
        "JML5",
        "REAL5",
        "JML6",
        "REAL6",
        "JML7",
        "REAL7",
        "JML8",
        "REAL8",
        "JML9",
        "REAL9",
        "JML10",
        "REAL10",
        "JML11",
        "REAL11",
        "JML12",
        "REAL12",
        "RENC",
        "RENC1",
        "REAL1",
        "RENC2",
        "REAL2",
        "RENC3",
        "REAL3",
        "RENC4",
        "REAL4",
        "RENC5",
        "REAL5",
        "RENC6",
        "REAL6",
        "RENC7",
        "REAL7",
        "RENC8",
        "REAL8",
        "RENC9",
        "REAL9",
        "RENC10",
        "REAL10",
        "RENC11",
        "REAL11",
        "RENC12",
        "REAL12",
        "VOLKEG",
        "HARGASAT",
        "JUMLAH",
        "INEFISIENSI",
      ];

      columnsToFormat.forEach((column) => formatNumericColumn(column));
      return row;
    });

    res.json(formattedResult);
  } catch (error) {
    console.error("Error:", error);
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const randomQueryPenerimaan = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = `${decryptedData} ORDER BY a.kddept, a.kdunit, a.kdsatker, a.bulan DESC LIMIT ${limit} OFFSET ${offset}`;
    const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${decryptedData}) AS totalCountSubquery`;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);
    //console.log(resultsQuery);
    const totalCount = totalCountResult[0].totalCount;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "PENERIMAAN",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};
export const randomQuery = async (req, res) => {
  const queryParams = req.query.queryParams;
  const decryptedData = decryptData(queryParams);
  // console.log(JSON.parse(decodeURIComponent(decryptedData)));
  try {
    const result = await db.query(
      JSON.parse(decodeURIComponent(decryptedData)),
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    res.json(result);
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};
export const chart = async (req, res) => {
  const queryParams = req.query["queryParams"];

  try {
    const result = await db.query(queryParams, {
      type: Sequelize.QueryTypes.SELECT,
    });

    res.json(result);
  } catch (Error) {
    console.error("Error:", Error);
    res.status(500).json({
      error: Error.original.sqlMessage,
    });
  }
};

export const randomQueryBansos = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = `
  ${decryptedData}
  ORDER BY a.kddept, a.kdunit, a.kdsatker, a.tahap, a.kdprov ASC
  LIMIT ${limit} OFFSET ${offset}
`;

    const totalCountQuery = `
SELECT COUNT(*) AS totalCount,SUM(jml1) AS JML1,  SUM(real1)/1 AS REAL1,  SUM(jml2) AS JML2,  SUM(real2)/1 AS REAL2,  SUM(jml3) AS JML3,  SUM(real3)/1 AS REAL3,  SUM(jml4) AS JML4,  SUM(real4)/1 AS REAL4,  SUM(jml5) AS JML5,  SUM(real5)/1 AS REAL5,  SUM(jml6) AS JML6,  SUM(real6)/1 AS REAL6,  SUM(jml7) AS JML7,  SUM(real7)/1 AS REAL7,  SUM(jml8) AS JML8,  SUM(real8)/1 AS REAL8,  SUM(jml9) AS JML9,  SUM(real9)/1 AS REAL9,  SUM(jml10) AS JML10,  SUM(real10)/1 AS REAL10,  SUM(jml11) AS JML11,  
SUM(real11)/1 AS REAL11,  SUM(jml12) AS JML12,  SUM(real12)/1 AS REAL12 FROM (${decryptedData}) AS totalCountSubquery
    `;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;
    const jml1 = totalCountResult[0].JML1;
    const jml2 = totalCountResult[0].JML2;
    const jml3 = totalCountResult[0].JML3;
    const jml4 = totalCountResult[0].JML4;
    const jml5 = totalCountResult[0].JML5;
    const jml6 = totalCountResult[0].JML6;
    const jml7 = totalCountResult[0].JML7;
    const jml8 = totalCountResult[0].JML8;
    const jml9 = totalCountResult[0].JML9;
    const jml10 = totalCountResult[0].JML10;
    const jml11 = totalCountResult[0].JML11;
    const jml12 = totalCountResult[0].JML12;
    const real1 = totalCountResult[0].REAL1;
    const real2 = totalCountResult[0].REAL2;
    const real3 = totalCountResult[0].REAL3;
    const real4 = totalCountResult[0].REAL4;
    const real5 = totalCountResult[0].REAL5;
    const real6 = totalCountResult[0].REAL6;
    const real7 = totalCountResult[0].REAL7;
    const real8 = totalCountResult[0].REAL8;
    const real9 = totalCountResult[0].REAL9;
    const real10 = totalCountResult[0].REAL10;
    const real11 = totalCountResult[0].REAL11;
    const real12 = totalCountResult[0].REAL12;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
      jml1: jml1,
      jml2: jml2,
      jml3: jml3,
      jml4: jml4,
      jml5: jml5,
      jml6: jml6,
      jml7: jml7,
      jml8: jml8,
      jml9: jml9,
      jml10: jml10,
      jml11: jml11,
      jml12: jml12,
      real1: real1,
      real2: real2,
      real3: real3,
      real4: real4,
      real5: real5,
      real6: real6,
      real7: real7,
      real8: real8,
      real9: real9,
      real10: real10,
      real11: real11,
      real12: real12,
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "BANSOS",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const randomQueryDeviasi = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const jenlap = req.query.jenlap;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = `
  ${decryptedData}
  ORDER BY a.kddept, a.kdunit, a.kdsatker DESC
  LIMIT ${limit} OFFSET ${offset}
`;
    let pagu = jenlap === "2" ? "" : "SUM(PAGU) AS PAGU1,";
    const totalCountQuery = `
    SELECT COUNT(*) AS totalCount,${pagu} SUM(RENC1) AS RENC1, SUM(REAL1) AS REAL1, SUM(RENC2) AS RENC2, SUM(REAL2) AS REAL2, SUM(RENC3) AS RENC3, SUM(REAL3) AS REAL3, SUM(RENC4) AS RENC4, SUM(REAL4) AS REAL4,  SUM(RENC5) AS RENC5, SUM(REAL5) AS REAL5, SUM(RENC6) AS RENC6,  SUM(REAL6) AS REAL6, SUM(RENC7) AS RENC7, SUM(REAL7) AS REAL7,  SUM(RENC8) AS RENC8, SUM(REAL8) AS REAL8, SUM(RENC9) AS RENC9,  SUM(REAL9) AS REAL9, SUM(RENC10) AS RENC10, SUM(REAL10) AS REAL10,  SUM(RENC11) AS RENC11, SUM(REAL11) AS REAL11, SUM(RENC12) AS RENC12,   SUM(REAL12) AS REAL12  FROM (${decryptedData}) AS totalCountSubquery
    `;
    // console.log(resultsQuery);
    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);
    //console.log(totalCountQuery);
    const totalCount = totalCountResult[0].totalCount;
    // const pagu1 = totalCountResult[0].PAGU1;
    const pagu1 = jenlap === "1" ? totalCountResult[0].PAGU1 : undefined;
    const jml1 = totalCountResult[0].RENC1;
    const jml2 = totalCountResult[0].RENC2;
    const jml3 = totalCountResult[0].RENC3;
    const jml4 = totalCountResult[0].RENC4;
    const jml5 = totalCountResult[0].RENC5;
    const jml6 = totalCountResult[0].RENC6;
    const jml7 = totalCountResult[0].RENC7;
    const jml8 = totalCountResult[0].RENC8;
    const jml9 = totalCountResult[0].RENC9;
    const jml10 = totalCountResult[0].RENC10;
    const jml11 = totalCountResult[0].RENC11;
    const jml12 = totalCountResult[0].RENC12;
    const real1 = totalCountResult[0].REAL1;
    const real2 = totalCountResult[0].REAL2;
    const real3 = totalCountResult[0].REAL3;
    const real4 = totalCountResult[0].REAL4;
    const real5 = totalCountResult[0].REAL5;
    const real6 = totalCountResult[0].REAL6;
    const real7 = totalCountResult[0].REAL7;
    const real8 = totalCountResult[0].REAL8;
    const real9 = totalCountResult[0].REAL9;
    const real10 = totalCountResult[0].REAL10;
    const real11 = totalCountResult[0].REAL11;
    const real12 = totalCountResult[0].REAL12;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
      ...(jenlap === "1" && { pagu: pagu1 }),
      jml1: jml1,

      jml2: jml2,
      jml3: jml3,
      jml4: jml4,
      jml5: jml5,
      jml6: jml6,
      jml7: jml7,
      jml8: jml8,
      jml9: jml9,
      jml10: jml10,
      jml11: jml11,
      jml12: jml12,
      real1: real1,
      real2: real2,
      real3: real3,
      real4: real4,
      real5: real5,
      real6: real6,
      real7: real7,
      real8: real8,
      real9: real9,
      real10: real10,
      real11: real11,
      real12: real12,
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "DEVIASI",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const inquiryApbn = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "").toUpperCase()
  );

  try {
    const resultsQuery = `
      ${decryptedData}
      ORDER BY a.kddept, a.kdunit, a.kdsatker DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const totalCountQuery = `
    SELECT COUNT(*) AS totalCount,SUM(PAGU_APBN) PAGU_APBN, SUM(PAGU_DIPA) PAGU_DIPA,
    SUM(REALISASI) REALISASI, SUM(BLOKIR) BLOKIR  FROM (${decryptedData}) AS totalCountSubquery
    `;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;
    const PAGU_DIPA = totalCountResult[0].PAGU_DIPA;
    const PAGU_APBN = totalCountResult[0].PAGU_APBN;
    const REALISASI = totalCountResult[0].REALISASI;
    const BLOKIR = totalCountResult[0].BLOKIR;

    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "INQUIRY_PAGU_APBN",
    });

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
      pagu_dipa: PAGU_DIPA,
      pagu_apbn: PAGU_APBN,
      realisasi: REALISASI,
      blokir: BLOKIR,
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const randomQueryBulanan = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = `
  ${decryptedData}
  ORDER BY a.kddept, a.kdunit, a.kdkppn, a.kdsatker DESC
  LIMIT ${limit} OFFSET ${offset}
`;

    const totalCountQuery = `
   SELECT COUNT(*) AS totalCount,
    SUM(JAN) P1,SUM(FEB) P2,SUM(MAR) P3, 
    SUM(APR) P4,SUM(MEI) P5,SUM(JUN) P6, 
    SUM(JUL) P7,SUM(AGS) P8,SUM(SEP) P9, 
    SUM(OKT) P10,SUM(NOV) P11,SUM(DES) P12
   
    FROM (${decryptedData}) AS totalCountSubquery`;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;
    const totalJan = totalCountResult[0].P1;
    const totalFeb = totalCountResult[0].P2;
    const totalMar = totalCountResult[0].P3;
    const totalApr = totalCountResult[0].P4;
    const totalMei = totalCountResult[0].P5;
    const totalJun = totalCountResult[0].P6;
    const totalJul = totalCountResult[0].P7;
    const totalAgs = totalCountResult[0].P8;
    const totalSep = totalCountResult[0].P9;
    const totalOkt = totalCountResult[0].P10;
    const totalNov = totalCountResult[0].P11;
    const totalDes = totalCountResult[0].P12;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
      totalJan: totalJan,
      totalFeb: totalFeb,
      totalMar: totalMar,
      totalApr: totalApr,
      totalMei: totalMei,
      totalJun: totalJun,
      totalJul: totalJul,
      totalAgs: totalAgs,
      totalSep: totalSep,
      totalOkt: totalOkt,
      totalNov: totalNov,
      totalDes: totalDes,
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "INQUIRY_PAGU_BULANAN",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const randomQueryBlokir = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = `
  ${decryptedData}
  ORDER BY a.kddept, a.kdunit, a.kdkppn, a.kdsatker DESC
  LIMIT ${limit} OFFSET ${offset}
`;

    const totalCountQuery = `
   SELECT COUNT(*) AS totalCount,
    SUM(JAN) P1,SUM(FEB) P2,SUM(MAR) P3, 
    SUM(APR) P4,SUM(MEI) P5,SUM(JUN) P6, 
    SUM(JUL) P7,SUM(AGS) P8,SUM(SEP) P9, 
    SUM(OKT) P10,SUM(NOV) P11,SUM(DES) P12
   
    FROM (${decryptedData}) AS totalCountSubquery`;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;
    const totalJan = totalCountResult[0].P1;
    const totalFeb = totalCountResult[0].P2;
    const totalMar = totalCountResult[0].P3;
    const totalApr = totalCountResult[0].P4;
    const totalMei = totalCountResult[0].P5;
    const totalJun = totalCountResult[0].P6;
    const totalJul = totalCountResult[0].P7;
    const totalAgs = totalCountResult[0].P8;
    const totalSep = totalCountResult[0].P9;
    const totalOkt = totalCountResult[0].P10;
    const totalNov = totalCountResult[0].P11;
    const totalDes = totalCountResult[0].P12;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
      totalJan: totalJan,
      totalFeb: totalFeb,
      totalMar: totalMar,
      totalApr: totalApr,
      totalMei: totalMei,
      totalJun: totalJun,
      totalJul: totalJul,
      totalAgs: totalAgs,
      totalSep: totalSep,
      totalOkt: totalOkt,
      totalNov: totalNov,
      totalDes: totalDes,
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "INQUIRY_BLOKIR_BULANAN",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const randomQueryJnsblokir = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;
  const thang = req.query.thang; // Keep thang as a string for comparison

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );
  // console.log(decryptedData);

  try {
    let resultsQuery, totalCountQuery;

    if (thang === "2024") {
      resultsQuery = `
        ${decryptedData}
        ORDER BY a.kddept, a.kdunit, a.kdkppn, a.kdsatker, a.kdblokir DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      totalCountQuery = `
        SELECT COUNT(*) AS totalCount,
          SUM(JUL) AS JUL, SUM(AGS) AS AGS, SUM(SEP) AS SEP,
          SUM(OKT) AS OKT, SUM(NOV) AS NOV, SUM(DES) AS DES
        FROM (${decryptedData}) AS totalCountSubquery
      `;
    } else {
      resultsQuery = `
        ${decryptedData}
        ORDER BY a.kddept, a.kdunit, a.kdkppn, a.kdsatker, a.kdblokir DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      totalCountQuery = `
        SELECT COUNT(*) AS totalCount,
          SUM(JAN) AS JAN, SUM(FEB) AS FEB, SUM(MAR) AS MAR,
          SUM(APR) AS APR, SUM(MEI) AS MEI, SUM(JUN) AS JUN,
          SUM(JUL) AS JUL, SUM(AGS) AS AGS, SUM(SEP) AS SEP,
          SUM(OKT) AS OKT, SUM(NOV) AS NOV, SUM(DES) AS DES
        FROM (${decryptedData}) AS totalCountSubquery
      `;
    }

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;
    const totalJan = totalCountResult[0].JAN || 0;
    const totalFeb = totalCountResult[0].FEB || 0;
    const totalMar = totalCountResult[0].MAR || 0;
    const totalApr = totalCountResult[0].APR || 0;
    const totalMei = totalCountResult[0].MEI || 0;
    const totalJun = totalCountResult[0].JUN || 0;
    const totalJul = totalCountResult[0].JUL || 0;
    const totalAgs = totalCountResult[0].AGS || 0;
    const totalSep = totalCountResult[0].SEP || 0;
    const totalOkt = totalCountResult[0].OKT || 0;
    const totalNov = totalCountResult[0].NOV || 0;
    const totalDes = totalCountResult[0].DES || 0;

    let response = {
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
    };

    if (thang === "2024") {
      response = {
        ...response,
        totalJul: totalJul,
        totalAgs: totalAgs,
        totalSep: totalSep,
        totalOkt: totalOkt,
        totalNov: totalNov,
        totalDes: totalDes,
      };
    } else {
      response = {
        ...response,
        totalJan: totalJan,
        totalFeb: totalFeb,
        totalMar: totalMar,
        totalApr: totalApr,
        totalMei: totalMei,
        totalJun: totalJun,
        totalJul: totalJul,
        totalAgs: totalAgs,
        totalSep: totalSep,
        totalOkt: totalOkt,
        totalNov: totalNov,
        totalDes: totalDes,
      };
    }

    res.json(response);

    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "INQUIRY_BLOKIR_BULANAN_PER_JENIS",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const randomQueryAkumulasi = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = `
  ${decryptedData}
  ORDER BY a.kddept, a.kdunit, a.kdkppn, a.kdsatker DESC
  LIMIT ${limit} OFFSET ${offset}
`;

    const totalCountQuery = `
   SELECT COUNT(*) AS totalCount, SUM(PAGU_DIPA) PAGU_DIPA,
    SUM(JAN) JAN,SUM(FEB) FEB,SUM(MAR) MAR, 
    SUM(APR) APR,SUM(MEI) MEI,SUM(JUN) JUN, 
    SUM(JUL) JUL,SUM(AGS) AGS,SUM(SEP) SEP, 
    SUM(OKT) OKT,SUM(NOV) NOV,SUM(DES) DES,SUM(BLOKIR) BLOKIR
   
    FROM (${decryptedData}) AS totalCountSubquery`;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;
    const pagu_dipa = totalCountResult[0].PAGU_DIPA;
    const totalJan = totalCountResult[0].JAN;
    const totalFeb = totalCountResult[0].FEB;
    const totalMar = totalCountResult[0].MAR;
    const totalApr = totalCountResult[0].APR;
    const totalMei = totalCountResult[0].MEI;
    const totalJun = totalCountResult[0].JUN;
    const totalJul = totalCountResult[0].JUL;
    const totalAgs = totalCountResult[0].AGS;
    const totalSep = totalCountResult[0].SEP;
    const totalOkt = totalCountResult[0].OKT;
    const totalNov = totalCountResult[0].NOV;
    const totalDes = totalCountResult[0].DES;
    const blokir = totalCountResult[0].BLOKIR;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
      pagu_dipa: pagu_dipa,
      blokir: blokir,
      totalJan: totalJan,
      totalFeb: totalFeb,
      totalMar: totalMar,
      totalApr: totalApr,
      totalMei: totalMei,
      totalJun: totalJun,
      totalJul: totalJul,
      totalAgs: totalAgs,
      totalSep: totalSep,
      totalOkt: totalOkt,
      totalNov: totalNov,
      totalDes: totalDes,
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "INQUIRY_PAGU_AKUMULASI",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const randomQueryKontrak = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = `${decryptedData}  ORDER BY a.kddept, a.kdunit, a.kdkppn, a.kdsatker DESC LIMIT ${limit} OFFSET ${offset}`;
    const totalCountQuery = `SELECT COUNT(*) AS totalCount,SUM(PAGU_KONTRAK) pagu_kontrak,SUM(realisasi_kontrak) realisasi_kontrak
    FROM (${decryptedData}) AS totalCountSubquery`;
    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;
    const pagu_kontrak = totalCountResult[0].pagu_kontrak;
    const realisasi_kontrak = totalCountResult[0].realisasi_kontrak;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
      pagu_kontrak: pagu_kontrak,
      realisasi_kontrak: realisasi_kontrak,
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "DATA_KONTRAK",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const randomQueryRkakl = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = `${decryptedData} ORDER BY a.kddept, a.kdunit, a.kdkppn, a.kdsatker DESC LIMIT ${limit} OFFSET ${offset}`;
    const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${decryptedData}) AS totalCountSubquery`;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "DATA_RKAKL",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const randomQueryUp = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = `${decryptedData} ORDER BY a.kddept, a.kdunit, a.kdkppn, a.kdsatker DESC LIMIT ${limit} OFFSET ${offset}`;
    const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${decryptedData}) AS totalCountSubquery`;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);
    //console.log(resultsQuery);
    const totalCount = totalCountResult[0].totalCount;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "OUTSTANDING UP/TUP",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const randomQuerySP2D = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = `${decryptedData} ORDER BY a.kddept, a.kdunit, a.kdkppn, a.kdsatker DESC LIMIT ${limit} OFFSET ${offset}`;
    const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${decryptedData}) AS totalCountSubquery`;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "ROWSET_SPM_SP2D",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const randomQueryRevisi = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = `${decryptedData} ORDER BY a.kddept, a.kdunit, a.kdsatker, a.tanggal DESC LIMIT ${limit} OFFSET ${offset}`;
    const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${decryptedData}) AS totalCountSubquery`;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);
    //console.log(resultsQuery);
    const totalCount = totalCountResult[0].totalCount;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "REVISI",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

export const randomQuerySpending = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decodeURIComponent(
    decryptData(queryParams).replace(/"/g, "")
  );

  try {
    const resultsQuery = `${decryptedData} ORDER BY a.id DESC LIMIT ${limit} OFFSET ${offset}`;
    const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${decryptedData}) AS totalCountSubquery`;

    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);
    //console.log(resultsQuery);
    const totalCount = totalCountResult[0].totalCount;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
    });
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "REVISI",
    });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      res.status(500).json({
        error: error.original.sqlMessage,
      });
    } else {
      res.status(500).json({
        error: "Terjadi kesalahan dalam pengambilan data.",
      });
    }
  }
};

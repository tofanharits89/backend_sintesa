const { oracle_db } = require("../db/Oracle.js");
const { koneksiLokal } = require("../db/database.js");

const columns = [
  "ID", "KODE_LOKASI", "AKUN", "KODE_DESA", "PAGU_SISA", "PAGU", "CREATE_DATE", "STATUS", "TAHUN", "KETERANGAN", "KELOMPOK",
  "PAGU_SILPA", "ALOKASI_TAHUN_DEPAN", "KODE_BANK", "NO_REKENING", "NAMA_REKENING", "BLT", "KPM_BULAN", "BLT_BULAN", "BLT_TAHUN",
  "NON_BLT_1", "NON_BLT_2", "NON_BLT_3", "STATUS_DESA", "TOTAL", "LAST_UPDATE", "SANKSI", "BLT2", "KPM_BULAN2", "NPWP",
  "BULAN1", "BULAN2", "BULAN3", "BULAN4", "BULAN5", "BULAN6", "BULAN7", "BULAN8", "BULAN9", "BULAN10", "BULAN11", "BULAN12",
  "SELISIH_BLT", "KODE_LOKASI_LAMA", "DISPEN_BLT", "KODE_DESA_LAMA", "KODE_DESA_TAMBAHAN", "PAGU_TAMBAHAN", "PANGAN", "STUNTING",
  "EARMARK1", "EARMARK2", "NON_BLT_1_P", "NON_BLT_2_P", "NON_BLT_3_P"
];

const onDuplicateUpdate = columns
  .map(col => `${col.toLowerCase()} = VALUES(${col.toLowerCase()})`)
  .join(", ");

async function tarik_dd_pagu(io) {
  const startTime = Date.now(); // Waktu mulai eksekusi
  let loadingInterval;

  try {
    io.emit("syncStatus", { message: "Sync process started..." });
    console.log("Sync process started...");
    loadingInterval = setInterval(() => process.stdout.write("."), 500);

    const oracleConnection = await oracle_db();
    const mysqlConnection = await koneksiLokal();

    io.emit("syncStatus", { message: "Connected to databases..." });

    const oracleQuery = `
      SELECT ${columns.join(", ")}
      FROM dd_t_pagu_2024
    `;

    io.emit("syncStatus", { message: "Fetching data from Oracle..." });
    console.log("\nFetching data from Oracle...");
    const oracleResult = await oracleConnection.execute(oracleQuery);
    const oracleData = oracleResult.rows;

    if (oracleData.length === 0) {
      io.emit("syncStatus", { message: "No data to sync." });
      console.log("\nNo data to sync.");
      return;
    }

    io.emit("syncStatus", { message: "Sanitizing data..." });
    const decimalColumns = ["PAGU_SISA", "PAGU", "PAGU_SILPA", "TOTAL", "BLT", "NON_BLT_1", "NON_BLT_2", "NON_BLT_3", "PAGU_TAMBAHAN"];
    const sanitizedData = oracleData.map(row => {
      decimalColumns.forEach(col => {
        const colIndex = columns.indexOf(col);
        if (colIndex !== -1 && (row[colIndex] === null || row[colIndex] === undefined)) {
          row[colIndex] = 0;
        }
      });
      return row;
    });

    const BATCH_SIZE = 500;
    for (let i = 0; i < sanitizedData.length; i += BATCH_SIZE) {
      const batchData = sanitizedData.slice(i, i + BATCH_SIZE);
      const placeholders = batchData.map(() => `(${columns.map(() => "?").join(", ")})`).join(", ");
      const query = `
        INSERT INTO repport_tkd.dd_pagu_24 (${columns.join(", ").toLowerCase()})
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE ${onDuplicateUpdate}
      `;
      const flattenedData = batchData.flat();
      await mysqlConnection.execute(query, flattenedData);

      io.emit("syncStatus", { message: `Batch ${Math.ceil((i + 1) / BATCH_SIZE)} synced.` });
      console.log(`Batch ${Math.ceil((i + 1) / BATCH_SIZE)} synced.`);
    }

    const endTime = Date.now();
    io.emit("syncStatus", { message: `Sync process completed in ${(endTime - startTime) / 1000} seconds` });
    console.log(`\nSync process completed in ${(endTime - startTime) / 1000} seconds`);
  } catch (error) {
    console.error("\nError:", error);
    io.emit("syncError", { message: error.message });
  } finally {
    if (loadingInterval) clearInterval(loadingInterval);
  }
}

module.exports = { tarik_dd_pagu };

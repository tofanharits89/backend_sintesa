const { oracle_db } = require("../db/Oracle.js");
const { koneksiLokal } = require("../db/database.js");

async function tarik_dd_header_detail(io) {
  const startTime = Date.now(); // Waktu mulai eksekusi
  let loadingInterval;

  try {
    // Emit proses dimulai
    io.emit("syncStatus", { status: "start", message: "Sync process started..." });
    console.log("Sync process started...");
    loadingInterval = setInterval(() => process.stdout.write("."), 500);

    // Koneksi ke database
    const oracleConnection = await oracle_db();
    const mysqlConnection = await koneksiLokal();

    // Query untuk menarik data dari Oracle
    const oracleQuery = `
      select ID, ID_REQ, KODE_DESA, PAGU_DESA, BATAS, KODE_LOKASI, CREATE_DATE, UPDATE_DATE, TAHAP, BATCH, KODE_BANK, NAMA_REKENING, NO_REKENING, DELETED, PERSENTASE, SISA_RKD, SUDAH_SALUR, PENYERAPAN_TL, PENYERAPAN_TAHAP1, CAPAIAN_OUTPUT_TAHAP1, MAKSIMAL, REGULER, BULAN, STATUS, JENIS, LAP_BLT, PROYEKSI_BLT, BATAS_SALUR, COVID, TAHAP2, POT1_SISA_RKD_2023, POT2_SISA_RKD_REKON, POT3_SISA_RKD_TIDAK_CUKUP, POT4_SANKSI_TIDAK_BLT, POT4_SANKSI_TIDAK_BLT_RP, DISPENSASI_POTONGAN, BATAS_ORIG, PENGURANGAN, MINUSS, POTONGAN_TAHAP3, EARMARK_BLT, EARMARK_PANGAN, EARMARK_STUNTING
      FROM dd_t_tahap1_detail_2024
    `;

    const columns = [
      "ID", "ID_REQ", "KODE_DESA", "PAGU_DESA", "BATAS", "KODE_LOKASI", "CREATE_DATE", "UPDATE_DATE", "TAHAP", "BATCH", 
      "KODE_BANK", "NAMA_REKENING", "NO_REKENING", "DELETED", "PERSENTASE", "SISA_RKD", "SUDAH_SALUR", "PENYERAPAN_TL", 
      "PENYERAPAN_TAHAP1", "CAPAIAN_OUTPUT_TAHAP1", "MAKSIMAL", "REGULER", "BULAN", "STATUS", "JENIS", "LAP_BLT", 
      "PROYEKSI_BLT", "BATAS_SALUR", "COVID", "TAHAP2", "POT1_SISA_RKD_2023", "POT2_SISA_RKD_REKON", 
      "POT3_SISA_RKD_TIDAK_CUKUP", "POT4_SANKSI_TIDAK_BLT", "POT4_SANKSI_TIDAK_BLT_RP", "DISPENSASI_POTONGAN", 
      "BATAS_ORIG", "PENGURANGAN", "MINUSS", "POTONGAN_TAHAP3", "EARMARK_BLT", "EARMARK_PANGAN", "EARMARK_STUNTING"
    ];

    const onDuplicateUpdate = columns.map(col => `${col} = VALUES(${col})`).join(", ");

    console.log("\nFetching data from Oracle...");
    io.emit("syncStatus", { status: "fetching", message: "Fetching data from Oracle..." });
    const oracleResult = await oracleConnection.execute(oracleQuery);
    const oracleData = oracleResult.rows;

    if (oracleData.length === 0) {
      console.log("\nNo data to sync.");
      io.emit("syncStatus", { status: "noData", message: "No data to sync." });
      return;
    }

    console.log("Syncing data to MySQL...");
    io.emit("syncStatus", { status: "syncing", message: "Syncing data to MySQL..." });
    const BATCH_SIZE = 1000;

    for (let i = 0; i < oracleData.length; i += BATCH_SIZE) {
      const batchData = oracleData.slice(i, i + BATCH_SIZE);
      const placeholders = batchData.map(() => `(${columns.map(() => "?").join(", ")})`).join(", ");
      const query = `
        INSERT INTO repport_tkd.dd_header_detail_24 (${columns.join(", ").toLowerCase()})
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE ${onDuplicateUpdate}
      `;
      const flattenedData = batchData.flat();
      await mysqlConnection.execute(query, flattenedData);
      console.log(`Batch ${Math.ceil((i + 1) / BATCH_SIZE)} synced.`);
      io.emit("syncStatus", { 
        status: "batchSynced", 
        message: `Batch ${Math.ceil((i + 1) / BATCH_SIZE)} synced.`,
        progress: ((i + BATCH_SIZE) / oracleData.length) * 100
      });
    }

    // Tutup koneksi
    await oracleConnection.close();
    await mysqlConnection.end();

    const endTime = Date.now();
    console.log(`\nSync process completed in ${(endTime - startTime) / 1000} seconds`);
    io.emit("syncStatus", { 
      status: "completed", 
      message: `Sync process completed in ${(endTime - startTime) / 1000} seconds` 
    });
  } catch (error) {
    console.error("\nError:", error);
    io.emit("syncStatus", { status: "error", message: `Error: ${error.message}` });
  } finally {
    if (loadingInterval) clearInterval(loadingInterval);
  }
}

module.exports = { tarik_dd_header_detail };

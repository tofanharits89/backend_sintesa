const { oracle_db } = require("../db/Oracle.js");
const { koneksiLokal } = require("../db/database.js");


async function tarik_tSerap(io) {
  const startTime = Date.now(); // Waktu mulai eksekusi
  let loadingInterval;

  try {
    // Emit: Proses dimulai
    io.emit("syncStart", { status: "Sync process started for t_serap" });

    // Mulai loading
    console.log("Sync process started...");
    loadingInterval = setInterval(() => process.stdout.write("."), 500);

    // Koneksi ke database
    const oracleConnection = await oracle_db();
    const mysqlConnection = await koneksiLokal();

    // Query untuk menarik data dari Oracle
    const oracleQuery = `
      SELECT ID, KODE_LOKASI, KODE_KPPN, KODE_BIDANG, AKUN, TAHAP, TGL_LAPORAN, KODE_DESA, KODE_KEGIATAN,
             VOLUME, SATUAN_OUTPUT, REALISASI, PERSENTASE, PIC1, PIC2, PIC3, CREATE_DATE, STATUS, 
             TAHUN, KETERANGAN, CARA_PENGADAAN, REALISASI2, PERSENTASE2, REALISASI3, PERSENTASE3, 
             KD_URAIAN_OUTPUT, TENAGA_KERJA, DURASI, UPAH, SUMBER_DATA, IMPORT_ID
      FROM dd_t_serap_2024
    `;

    // Kolom yang digunakan di tabel MySQL
    const columns = [
      "ID", "KODE_LOKASI", "KODE_KPPN", "KODE_BIDANG", "AKUN", "TAHAP", "TGL_LAPORAN", "KODE_DESA",
      "KODE_KEGIATAN", "VOLUME", "SATUAN_OUTPUT", "REALISASI", "PERSENTASE", "PIC1", "PIC2", "PIC3", 
      "CREATE_DATE", "STATUS", "TAHUN", "KETERANGAN", "CARA_PENGADAAN", "REALISASI2", "PERSENTASE2",
      "REALISASI3", "PERSENTASE3", "KD_URAIAN_OUTPUT", "TENAGA_KERJA", "DURASI", "UPAH", "SUMBER_DATA", 
      "IMPORT_ID"
    ];

    // Kolom untuk UPDATE ON DUPLICATE KEY
    const onDuplicateUpdate = columns.map(col => `${col} = VALUES(${col})`).join(", ");

    // Tarik data dari Oracle
    console.log("\nFetching data from Oracle...");
    const oracleResult = await oracleConnection.execute(oracleQuery);
    const oracleData = oracleResult.rows;

    if (oracleData.length === 0) {
      console.log("\nNo data to sync.");
      io.emit("syncStatus", { status: "No data to sync", table: "t_serap", total: 0 });
      return;
    }

    // Masukkan data ke MySQL secara batch
    console.log("Syncing data to MySQL...");
    const BATCH_SIZE = 2000; // Ukuran batch
    for (let i = 0; i < oracleData.length; i += BATCH_SIZE) {
      const batchData = oracleData.slice(i, i + BATCH_SIZE);
      const placeholders = batchData.map(() => `(${columns.map(() => "?").join(", ")})`).join(", ");
      const query = `
        INSERT INTO repport_tkd.t_serap_24 (${columns.join(", ")})
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE ${onDuplicateUpdate}
      `;
      const flattenedData = batchData.flat();
      await mysqlConnection.execute(query, flattenedData);
      const currentBatch = Math.ceil((i + 1) / BATCH_SIZE);

      // Emit: Status setiap batch selesai
      io.emit("syncProgress", {
        status: "Batch synced",
        table: "t_serap",
        batch: currentBatch,
        totalBatches: Math.ceil(oracleData.length / BATCH_SIZE),
      });
      console.log(`Batch ${currentBatch} synced.`);
    }

    // Tutup koneksi
    await oracleConnection.close();
    await mysqlConnection.end();

    // Emit: Proses selesai
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    io.emit("syncComplete", {
      status: "Sync process completed for t_serap",
      table: "t_serap",
      duration,
      totalRecords: oracleData.length,
    });

    console.log(`\nSync process completed in ${duration} seconds`);
  } catch (error) {
    console.error("\nError:", error);
    io.emit("syncError", { status: "Error during sync", table: "t_serap", error: error.message });
  } finally {
    if (loadingInterval) clearInterval(loadingInterval); // Hentikan loading
  }
}

// Jalankan fungsi
module.exports = { tarik_tSerap };

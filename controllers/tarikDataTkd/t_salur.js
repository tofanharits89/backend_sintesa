const { oracle_db } = require("../db/Oracle.js");
const { koneksiLokal } = require("../db/database.js");


async function tarik_tSalur(io) {
  const startTime = Date.now(); // Waktu mulai eksekusi
  let loadingInterval;

  try {
    // Emit: Proses dimulai
    io.emit("syncStart", { status: "Sync process started" });

    // Mulai loading
    console.log("Sync process started...");
    loadingInterval = setInterval(() => process.stdout.write("."), 500);

    // Koneksi ke database
    const oracleConnection = await oracle_db();
    const mysqlConnection = await koneksiLokal();

    // Query untuk menarik data dari Oracle
    const oracleQuery = `
      SELECT id, kode_lokasi, akun, tahap, kode_desa, no_sp2d, tgl_sp2d, realisasi,
             create_date, status, tahun, kewenangan, no_sp2d_bun, keterangan, 
             id_silpa, import_id, id_req, tgl_sp2d_bun, kode_bank, no_rekening,
             nama_rekening, jenis, bulan, no_spp, tgl_spp, blt, pangan, stunting
      FROM dd_t_salur_2024
    `;

    // Kolom untuk MySQL
    const columns = [
      "id", "kode_lokasi", "akun", "tahap", "kode_desa", "no_sp2d", "tgl_sp2d", "realisasi",
      "create_date", "status", "tahun", "kewenangan", "no_sp2d_bun", "keterangan",
      "id_silpa", "import_id", "id_req", "tgl_sp2d_bun", "kode_bank", "no_rekening",
      "nama_rekening", "jenis", "bulan", "no_spp", "tgl_spp", "blt", "pangan", "stunting"
    ];
    const onDuplicateUpdate = columns.map(col => `${col} = VALUES(${col})`).join(", ");

    // Tarik data dari Oracle
    console.log("\nFetching data from Oracle...");
    const oracleResult = await oracleConnection.execute(oracleQuery);
    const oracleData = oracleResult.rows;

    if (oracleData.length === 0) {
      console.log("\nNo data to sync.");
      io.emit("syncStatus", { status: "No data to sync", total: 0 });
      return;
    }

    // Masukkan data ke MySQL secara batch
    console.log("Syncing data to MySQL...");
    const BATCH_SIZE = 2000; // Ukuran batch
    for (let i = 0; i < oracleData.length; i += BATCH_SIZE) {
      const batchData = oracleData.slice(i, i + BATCH_SIZE);
      const placeholders = batchData.map(() => `(${columns.map(() => "?").join(", ")})`).join(", ");
      const query = `
        INSERT INTO repport_tkd.t_salur_24 (${columns.join(", ")})
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE ${onDuplicateUpdate}
      `;
      const flattenedData = batchData.flat();
      await mysqlConnection.execute(query, flattenedData);
      const currentBatch = Math.ceil((i + 1) / BATCH_SIZE);

      // Emit: Status setiap batch selesai
      io.emit("syncProgress", {
        status: "Batch synced",
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
      status: "Sync process completed",
      duration,
      totalRecords: oracleData.length,
    });

    console.log(`\nSync process completed in ${duration} seconds`);
  } catch (error) {
    console.error("\nError:", error);
    io.emit("syncError", { status: "Error during sync", error: error.message });
  } finally {
    if (loadingInterval) clearInterval(loadingInterval); // Hentikan loading
  }
}

// Jalankan fungsi
module.exports = { tarik_tSalur };

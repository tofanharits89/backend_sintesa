const { oracle_db } = require("../db/Oracle.js");
const { koneksiLokal } = require("../db/database.js");

async function tarik_dd_header(io) {
  const startTime = Date.now(); // Waktu mulai eksekusi
  let loadingInterval;

  try {
    // Emit event untuk memulai proses
    io.emit("syncStatus", { message: "Sync process started..." });
    console.log("Sync process started...");
    loadingInterval = setInterval(() => process.stdout.write("."), 500);

    // Koneksi ke database
    io.emit("syncStatus", { message: "Connecting to databases..." });
    const oracleConnection = await oracle_db();
    const mysqlConnection = await koneksiLokal();
    io.emit("syncStatus", { message: "Connected to databases." });

    // Query untuk menarik data dari Oracle
    const oracleQuery = `
      SELECT id_req, tahap, kode_lokasi, batch, tgl_pengajuan, status, update_by, update_date, create_date, no_sp2d, tgl_sp2d, kewenangan, kode_akun, nilai_sp2d, kode_kppn, tgl_spp, no_spp, tgl_proses_kppn, reguler, bulan, jenis, uraian, jns_desa
      FROM dd_tahap1_header_2024
    `;

    // Kolom yang digunakan di tabel MySQL
    const columns = [
      "id_req", "tahap", "kode_lokasi", "batch", "tgl_pengajuan", "status", "update_by", "update_date", "create_date", "no_sp2d", "tgl_sp2d",
      "kewenangan", "kode_akun", "nilai_sp2d", "kode_kppn", "tgl_spp", "no_spp", "tgl_proses_kppn", "reguler", "bulan", "jenis", "uraian", "jns_desa"
    ];

    // Kolom untuk UPDATE ON DUPLICATE KEY
    const onDuplicateUpdate = columns.map(col => `${col} = VALUES(${col})`).join(", ");

    // Tarik data dari Oracle
    io.emit("syncStatus", { message: "Fetching data from Oracle..." });
    console.log("\nFetching data from Oracle...");
    const oracleResult = await oracleConnection.execute(oracleQuery);
    const oracleData = oracleResult.rows;

    if (oracleData.length === 0) {
      io.emit("syncStatus", { message: "No data to sync." });
      console.log("\nNo data to sync.");
      return;
    }

    // Masukkan data ke MySQL secara batch
    io.emit("syncStatus", { message: "Syncing data to MySQL..." });
    console.log("Syncing data to MySQL...");
    const BATCH_SIZE = 500; // Ukuran batch
    for (let i = 0; i < oracleData.length; i += BATCH_SIZE) {
      const batchData = oracleData.slice(i, i + BATCH_SIZE);
      const placeholders = batchData.map(() => `(${columns.map(() => "?").join(", ")})`).join(", ");
      const query = `
        INSERT INTO repport_tkd.dd_header_24 (${columns.join(", ")})
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE ${onDuplicateUpdate}
      `;
      const flattenedData = batchData.flat();
      await mysqlConnection.execute(query, flattenedData);

      // Emit status untuk setiap batch selesai
      const batchNumber = Math.ceil((i + 1) / BATCH_SIZE);
      io.emit("syncStatus", { message: `Batch ${batchNumber} synced.` });
      console.log(`Batch ${batchNumber} synced.`);
    }

    // Tutup koneksi
    await oracleConnection.close();
    await mysqlConnection.end();
    io.emit("syncStatus", { message: "Database connections closed." });

    // Selesai
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    io.emit("syncStatus", { message: `Sync process completed in ${duration} seconds.` });
    console.log(`\nSync process completed in ${duration} seconds`);
  } catch (error) {
    console.error("\nError:", error);
    io.emit("syncError", { message: error.message });
  } finally {
    if (loadingInterval) clearInterval(loadingInterval); // Hentikan loading
  }
}

module.exports = { tarik_dd_header };

const { oracle_db } = require("../db/Oracle.js");
const { koneksiLokal } = require("../db/database.js");

async function tarik_summaryTahap(io) { // Tambahkan parameter `io`
  const startTime = Date.now(); // Waktu mulai eksekusi
  let loadingInterval;

  try {
    // Emit proses dimulai
    io.emit("syncStatus", { status: "started", message: "Sync process started..." });

    // Mulai loading
    console.log("Sync process started...");
    loadingInterval = setInterval(() => process.stdout.write("."), 500);

    // Koneksi ke database
    const oracleConnection = await oracle_db();
    const mysqlConnection = await koneksiLokal();

    // Definisi query
    const queries = [
      {
        query: `
          SELECT 
            substr(kode_lokasi, 1, 2) AS kode_lokasi_prefix,
            SUM(CASE WHEN status_desa = 'MANDIRI' THEN 1 ELSE 0 END) AS count_mandiri,
            SUM(CASE WHEN status_desa <> 'MANDIRI' THEN 1 ELSE 0 END) AS count_non_mandiri,
            SUM(CASE WHEN status_desa = 'MANDIRI' THEN pagu ELSE 0 END) + 
            SUM(CASE WHEN status_desa = 'MANDIRI' THEN pagu_tambahan ELSE 0 END) AS total_mandiri,
            SUM(CASE WHEN status_desa <> 'MANDIRI' THEN pagu ELSE 0 END) + 
            SUM(CASE WHEN status_desa <> 'MANDIRI' THEN pagu_tambahan ELSE 0 END) AS total_non_mandiri,
            SUM(pagu) + SUM(pagu_tambahan) AS total_pagu,
            SUM(kpm_bulan) AS KPM
          FROM dd_t_pagu_2024
          GROUP BY substr(kode_lokasi, 1, 2)
          ORDER BY substr(kode_lokasi, 1, 2)
        `,
        columns: [
          "kode_lokasi", "mandiri", "non_mandiri", "pagu_mandiri",
          "pagu_non_mandiri", "total_pagu", "KPM"
        ],
        table: "repport_tkd.dd_summary"
      },
      {
        query: `
          SELECT SUBSTR(a.kode_lokasi, 1, 2) AS kode_lokasi,
            COUNT(DISTINCT CASE WHEN a.jenis = 'REGULER' AND b.status_desa = 'MANDIRI' THEN a.kode_desa END) AS desa_reg_mandiri,
            COUNT(DISTINCT CASE WHEN a.jenis = 'REGULER' AND b.status_desa <> 'MANDIRI' THEN a.kode_desa END) AS desa_reg_non_mandiri,
            SUM(CASE WHEN a.jenis = 'REGULER' AND b.status_desa = 'MANDIRI' THEN a.realisasi ELSE 0 END) AS tot_reg_mandiri,
            SUM(CASE WHEN a.jenis = 'REGULER' AND b.status_desa <> 'MANDIRI' THEN a.realisasi ELSE 0 END) AS tot_reg_non_mandiri,
            SUM(CASE WHEN a.jenis = 'REGULER' THEN a.realisasi ELSE 0 END) AS tot_reg,
            COUNT(DISTINCT CASE WHEN a.jenis = 'EARMARK' AND b.status_desa = 'MANDIRI' THEN a.kode_desa END) AS desa_ear_mandiri,
            COUNT(DISTINCT CASE WHEN a.jenis = 'EARMARK' AND b.status_desa <> 'MANDIRI' THEN a.kode_desa END) AS desa_ear_non_mandiri,
            SUM(CASE WHEN a.jenis = 'EARMARK' AND b.status_desa = 'MANDIRI' THEN a.realisasi ELSE 0 END) AS tot_ear_mandiri,
            SUM(CASE WHEN a.jenis = 'EARMARK' AND b.status_desa <> 'MANDIRI' THEN a.realisasi ELSE 0 END) AS tot_ear_non_mandiri,
            SUM(CASE WHEN a.jenis = 'EARMARK' THEN a.realisasi ELSE 0 END) AS tot_ear,
            SUM(a.realisasi) AS total
          FROM dd_t_salur_2024 a
          INNER JOIN dd_t_pagu_2024 b ON a.kode_desa = b.kode_desa AND a.kode_lokasi = b.kode_lokasi
          GROUP BY SUBSTR(a.kode_lokasi, 1, 2)
          ORDER BY kode_lokasi
        `,
        columns: [
          "kode_lokasi", "desa_reg_mandiri", "desa_reg_non_mandiri",
          "tot_reg_mandiri", "tot_reg_non_mandiri", "tot_reg",
          "desa_ear_mandiri", "desa_ear_non_mandiri",
          "tot_ear_mandiri", "tot_ear_non_mandiri", "tot_ear", "total"
        ],
        table: "repport_tkd.dd_summary_detail"
      }
    ];

    // Eksekusi query dan sinkronisasi
    for (const { query, columns, table } of queries) {
      console.log(`\nFetching data from Oracle (${table})...`);
      io.emit("syncStatus", { status: "in_progress", message: `Fetching data from Oracle (${table})...` });

      const result = await oracleConnection.execute(query);
      const data = result.rows;

      if (data.length === 0) {
        console.log(`\nNo data to sync for ${table}.`);
        io.emit("syncStatus", { status: "no_data", table });
      } else {
        console.log(`Syncing data to MySQL (${table})...`);
        io.emit("syncStatus", { status: "syncing", table });

        await syncDataToMySQL(mysqlConnection, data, columns, table);
      }
    }

    // Update nama_lokasi
    console.log("\nUpdating nama_lokasi in repport_tkd.dd_summary...");
    io.emit("syncStatus", { status: "in_progress", message: "Updating nama_lokasi..." });

    await mysqlConnection.execute(`
      UPDATE repport_tkd.dd_summary a
      LEFT JOIN repport_tkd.t_lokasi b ON a.kode_lokasi = b.kdlokasi
      SET a.nama_lokasi = b.nmlokasi;
    `);
    console.log("nama_lokasi updated successfully.");
    io.emit("syncStatus", { status: "completed", message: "nama_lokasi updated successfully." });

    // Tutup koneksi
    await oracleConnection.close();
    await mysqlConnection.end();

    // Emit selesai
    const endTime = Date.now();
    console.log(`\nSync process completed in ${(endTime - startTime) / 1000} seconds`);
    io.emit("syncStatus", { status: "completed", duration: (endTime - startTime) / 1000 });
  } catch (error) {
    console.error("\nError:", error);
    io.emit("syncStatus", { status: "error", error: error.message });
  } finally {
    if (loadingInterval) clearInterval(loadingInterval); // Hentikan loading
  }
}

async function syncDataToMySQL(mysqlConnection, data, columns, tableName) {
  const BATCH_SIZE = 5000;
  const onDuplicateUpdate = columns.map(col => `${col} = VALUES(${col})`).join(", ");

  const sanitizedData = data.map(row =>
    row.map(value => (value === null ? 0 : value))
  );

  for (let i = 0; i < sanitizedData.length; i += BATCH_SIZE) {
    const batchData = sanitizedData.slice(i, i + BATCH_SIZE);
    const placeholders = batchData.map(() => `(${columns.map(() => "?").join(", ")})`).join(", ");
    const query = `
      INSERT INTO ${tableName} (${columns.join(", ")})
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE ${onDuplicateUpdate}
    `;

    const flattenedData = batchData.flat();
    await mysqlConnection.execute(query, flattenedData);
    console.log(`Batch ${Math.ceil((i + 1) / BATCH_SIZE)} synced for ${tableName}.`);
  }
}

// Jalankan fungsi
module.exports = { tarik_summaryTahap };

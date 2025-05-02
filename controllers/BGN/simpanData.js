// import db from "../config/Database135MBG.js";
import db from "../../config/Database135MBG.js";
import axios from "axios";
import fs from "fs";
import ioServer from "../../index.js";

// ====================== Helper Emit + Log ======================
const log = (msg) => {
  console.log(msg);
  ioServer.emit("bgn", msg); // Emit log ke frontend menggunakan socket.io
};

export const saveDataBGNUtama = async (cookieHeader) => {
  try {
    log("📡 Mengirim request ke /RekapMitraOpsnal/tampilRekap...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const response = await axios.post(
      "https://dialur.bgn.go.id/RekapMitraOpsnal/tampilRekap",
      new URLSearchParams({
        token:
          "YzdjYWQwMGNkNDQwZTIwNWJkY2E5YzU0NDNiZDNhZTI5ZDI3OGI2OTJjZDdkNzJiNTU3OTQwZGY5N2Y5NjU5NQ==",
        UserID: "101",
        rekapTglAwal: "",
        rekapTglAkhir: "",
        mode: "tampilRekap1",
        wil_level: "1",
        wil_induk: "",
        pil_bulan: "",
        pil_tahun: "",
        pil_formasi: "",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: cookieHeader,
        },
        timeout: 10000,
      }
    );

    log("📥 Data SPPG dari API diterima");

    // Simpan response mentah ke file
    const jsonResponse = JSON.stringify(response.data, null, 2);
    fs.writeFileSync("dataTampungan/response.json", jsonResponse, "utf8");
    // log("📁 Response disimpan ke 'response.json'.");

    // Bersihkan dan simpan data
    await cleanDataFromFile();
    await saveCleanedDataToDB();

    log("✅ Data BGN berhasil disimpan ke database.");
  } catch (err) {
    console.error("❌ Gagal mendapatkan response:", err.message);
    log(`❌ Gagal mendapatkan response: ${err.message}`);
    throw err;
  }
};

// 🔧 Membersihkan data response dari pesan error dan simpan ke file baru
const cleanDataFromFile = async () => {
  try {
    const rawData = fs.readFileSync("dataTampungan/response.json", "utf8");

    // Bersihkan error "Undefined array key 1"
    const updatedData = rawData
      .replace(/Undefined array key 1\\n/g, "")
      .replace(/Undefined array key 1\n/g, "")
      .replace(/Undefined array key 1/g, "");

    // Tulis hasil pembersihan ke cleaned.json
    fs.writeFileSync("dataTampungan/cleaned.json", updatedData, "utf8");
    log("🧹 File 'dataTampungan/cleaned.json' berhasil diperbarui.");
  } catch (err) {
    console.error("❌ Gagal membersihkan data:", err.message);
    log(`❌ Gagal membersihkan data: ${err.message}`);
    throw err;
  }
};

// 📦 Menyimpan data utama dari cleaned.json ke database
const saveCleanedDataToDB = async () => {
  try {
    const rawData = fs.readFileSync("dataTampungan/cleaned.json", "utf8");

    if (!rawData || rawData.trim() === "") {
      log("❌ File cleaned.json kosong!");
      throw new Error("❌ File dataTampungan/cleaned.json kosong!");
    }

    let data;
    try {
      const parsedOnce = JSON.parse(rawData); // hasilnya masih string
      data = JSON.parse(parsedOnce); // baru hasil object
    } catch (parseErr) {
      console.error("❌ Gagal parsing JSON:", parseErr.message);
      log(`❌ Gagal parsing JSON: ${parseErr.message}`);
      throw parseErr;
    }

    const dataUtama = Array.isArray(data) ? data : data?.utama || [];

    if (dataUtama.length === 0) {
      log("⚠️ Tidak ada data utama untuk disimpan.");
      return;
    }

    // Truncate the table before inserting new data
    await db.query(`TRUNCATE TABLE data_bgn.data_sppg`);
    await new Promise((resolve) => setTimeout(resolve, 500));

    for (const item of dataUtama) {
      try {
        await db.query(
          `INSERT INTO data_bgn.data_sppg (
          WilProv, WilProvNama, WilKab, WilKabNama, WilKec, WilKecNama,
          WilKode, WilNama, WilKeyword, wilID, name, hc_key, Nama, prov,
          value, jum_total, jum_total_2, jum_total_3, jum_total_4, jum_total_5,
          jum_potensi, jum_dapur, jum_penerima, wil_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          {
            replacements: [
              item.WilProv,
              item.WilProvNama,
              item.WilKab,
              item.WilKabNama,
              item.WilKec,
              item.WilKecNama,
              item.WilKode,
              item.WilNama,
              item.WilKeyword,
              item.wilID,
              item.name,
              item["hc-key"],
              item.Nama,
              item.prov,
              item.value,
              item.jum_total,
              item.jum_total_2,
              item.jum_total_3,
              item.jum_total_4,
              item.jum_total_5,
              item.jum_potensi,
              item.jum_dapur,
              item.jum_penerima,
              item.wil_level,
            ],
            type: db.QueryTypes.INSERT,
          }
        );
      } catch (err) {
        console.error(`❌ Gagal insert `, err.message);
        log(`❌ Gagal insert data untuk item ${item.WilNama}`);
      }
    }

    log("✅ Data utama BGN berhasil disimpan ke database.");
  } catch (err) {
    console.error("❌ Gagal menyimpan data utama:", err.message);
    log(`❌ Gagal menyimpan data utama: ${err.message}`);
    throw err;
  }
};

// Fungsi untuk menyimpan data by_jenis
export const saveByJenis = async (data) => {
  for (const item of data) {
    await db.query(
      `INSERT INTO data_bgn.by_jenis (id, name, y, title, detail) 
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), y=VALUES(y), title=VALUES(title), detail=VALUES(detail)`,
      {
        replacements: [item.id, item.name, item.y, item.title, item.detail],
        type: db.QueryTypes.INSERT,
      }
    );
  }
};

// Fungsi untuk menyimpan data by_kelompok
export const saveByKelompok = async (data) => {
  for (const item of data) {
    let idDetail = null;
    let tipeDetail = null;

    if (item.detail) {
      const match = item.detail.match(/loadDataDetail\('(\d+)','([\w_]+)'\)/);
      if (match) {
        idDetail = match[1];
        tipeDetail = match[2];
      }
    }

    await db.query(
      `INSERT INTO data_bgn.by_kelompok (id, name, y, title, detail, id_detail, tipe_detail) 
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         name=VALUES(name), 
         y=VALUES(y), 
         title=VALUES(title), 
         detail=VALUES(detail), 
         id_detail=VALUES(id_detail), 
         tipe_detail=VALUES(tipe_detail)`,
      {
        replacements: [
          item.id,
          item.name,
          item.y,
          item.title,
          item.detail,
          idDetail,
          tipeDetail,
        ],
        type: db.QueryTypes.INSERT,
      }
    );
  }
};

// Fungsi untuk menyimpan data by_penerima
export const saveByPenerima = async (data) => {
  for (const item of data) {
    let idDetail = null;
    let tipeDetail = null;

    if (item.detail) {
      const match = item.detail.match(/loadDataDetail\('(\d+)','([\w_]+)'\)/);
      if (match) {
        idDetail = match[1];
        tipeDetail = match[2];
      }
    }

    await db.query(
      `INSERT INTO data_bgn.by_penerima (id, name, y, title, detail, id_detail, tipe_detail) 
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         name=VALUES(name), 
         y=VALUES(y), 
         title=VALUES(title), 
         detail=VALUES(detail), 
         id_detail=VALUES(id_detail), 
         tipe_detail=VALUES(tipe_detail)`,
      {
        replacements: [
          item.id,
          item.name,
          item.y,
          item.title,
          item.detail,
          idDetail,
          tipeDetail,
        ],
        type: db.QueryTypes.INSERT,
      }
    );
  }
};

// Fungsi untuk menyimpan data by_petugas
export const saveByPetugas = async (data) => {
  for (const item of data) {
    await db.query(
      `INSERT INTO data_bgn.by_petugas (id, name, y, title, detail) 
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), y=VALUES(y), title=VALUES(title), detail=VALUES(detail)`,
      {
        replacements: [item.id, item.name, item.y, item.title, item.detail],
        type: db.QueryTypes.INSERT,
      }
    );
  }
};

// Fungsi untuk menyimpan data by_supplier
export const saveBySupplier = async (data) => {
  for (const item of data) {
    await db.query(
      `INSERT INTO data_bgn.by_supplier (id, name, y, title, detail) 
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), y=VALUES(y), title=VALUES(title), detail=VALUES(detail)`,
      {
        replacements: [item.id, item.name, item.y, item.title, item.detail],
        type: db.QueryTypes.INSERT,
      }
    );
  }
};

// Fungsi untuk menyimpan data by_mitra
export const saveByMitra = async (data) => {
  for (const item of data) {
    await db.query(
      `INSERT INTO data_bgn.by_mitra (id, name, y, title, detail) 
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), y=VALUES(y), title=VALUES(title), detail=VALUES(detail)`,
      {
        replacements: [item.id, item.name, item.y, item.title, item.detail],
        type: db.QueryTypes.INSERT,
      }
    );
  }
};

// Fungsi untuk menyimpan data by_sekarang
export const saveBySekarang = async (data) => {
  await db.query(
    `INSERT INTO data_bgn.by_sekarang (jum_produksi, jum_terima, detail) 
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE jum_produksi=VALUES(jum_produksi), jum_terima=VALUES(jum_terima), detail=VALUES(detail)`,
    {
      replacements: [data.jum_produksi, data.jum_terima, data.detail],
      type: db.QueryTypes.INSERT,
    }
  );
};

// Fungsi untuk menyimpan data by_kemarin
export const saveByKemarin = async (data) => {
  await db.query(
    `INSERT INTO data_bgn.by_kemarin (jum_produksi, jum_terima, detail) 
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE jum_produksi=VALUES(jum_produksi), jum_terima=VALUES(jum_terima), detail=VALUES(detail)`,
    {
      replacements: [data.jum_produksi, data.jum_terima, data.detail],
      type: db.QueryTypes.INSERT,
    }
  );
};

// Fungsi untuk menyimpan data by_kemarin
export const saveUpdate = async (username) => {
  // Hapus isi tabel 'update'
  await db.query(`TRUNCATE TABLE data_bgn.update`);

  // Update provinsi dari data_sppg ke by_kelompok_detail
  await db.query(`
    UPDATE data_bgn.by_kelompok_detail AS a
    LEFT JOIN (
      SELECT wilprov, wilprovnama
      FROM data_bgn.data_sppg
    ) AS b ON a.provinsi = b.wilprovnama
    SET a.wilprov = b.wilprov
  `);

  // Matikan safe update
  await db.query(`SET SQL_SAFE_UPDATES = 0`);

  // Update group_kelompok dan kode_RO satu per satu
  await db.query(
    `UPDATE data_bgn.by_kelompok SET group_kelompok='PAUD/RA/TK',kode_KRO='QEA',kode_RO='001' ,kdgiat='7072' WHERE name IN ('PAUD','TK','RA')`
  );
  await db.query(
    `UPDATE data_bgn.by_kelompok SET group_kelompok='SD/MI', kode_KRO='QEA',kode_RO='002',kdgiat='7072' WHERE name IN ('SD 4-6','MI 4-6','SD 1-3','MI 1-3')`
  );
  await db.query(
    `UPDATE data_bgn.by_kelompok SET group_kelompok='SMP/MTs/PKBM', kode_KRO='QEA',kode_RO='003',kdgiat='7072' WHERE name IN ('SMP','MTs','Seminari','PKBM')`
  );
  await db.query(
    `UPDATE data_bgn.by_kelompok SET group_kelompok='SMA/MA/SMK', kode_KRO='QEA',kode_RO='004',kdgiat='7072' WHERE name IN ('SMA','MA','SMK','MAN','MAK')`
  );
  await db.query(
    `UPDATE data_bgn.by_kelompok SET group_kelompok='SLB', kode_KRO='QEA',kode_RO='005',kdgiat='7072' WHERE name IN ('SLB')`
  );
  await db.query(
    `UPDATE data_bgn.by_kelompok SET group_kelompok='SANTRI', kode_KRO='QEA',kode_RO='006',kdgiat='7072' WHERE name IN ('PONPES')`
  );
  await db.query(
    `UPDATE data_bgn.by_kelompok SET group_kelompok='BUMIL', kode_KRO='QEA',kode_RO='001',kdgiat='7073' WHERE name IN ('BUMIL')`
  );
  await db.query(
    `UPDATE data_bgn.by_kelompok SET group_kelompok='BUSUI', kode_KRO='QEA',kode_RO='002',kdgiat='7073' WHERE name IN ('BUSUI')`
  );
  await db.query(
    `UPDATE data_bgn.by_kelompok SET group_kelompok='BALITA', kode_KRO='QEA',kode_RO='003',kdgiat='7073',kdgiat2='7072' WHERE name IN ('BALITA')`
  );

  // TAMBAHKAN PENGAMBILAN DATA DARI SERVER MONEV DISINI
  await db.query(`TRUNCATE data_bgn.data_summary_mbg`);
  await db.query(`INSERT INTO data_bgn.data_summary_mbg (
  mbg,
  kdgiat,
  kdoutput,
  kdsoutput,
  pagu,
  realisasi,
  blokir
)
SELECT 
  'UTAMA',
  a.kdgiat,
  a.kdoutput,
  a.kdsoutput,
  ROUND(SUM(a.pagu), 0) AS pagu,
  ROUND(SUM(
    real1 + real2 + real3 + real4 + real5 + real6 + 
    real7 + real8 + real9 + real10 + real11 + real12
  ), 0) AS realisasi,
  ROUND(SUM(a.blokir), 0) AS blokir
FROM 
  monev2025.a_pagu_real_bkpk_dja_2025 a 
WHERE 
  a.MBG IS NOT NULL 
  AND a.mbg = 'UTAMA' 
  AND a.kdoutput NOT IN ('RAB', 'RBV')
GROUP BY 
  a.kdgiat, a.kdoutput, a.kdsoutput, a.MBG;
`);

  // Simpan log update
  await db.query(
    `INSERT INTO data_bgn.update (username, keterangan, waktu) VALUES (?, ?, NOW())`,
    {
      replacements: [username, "Update data MBG"],
      type: db.QueryTypes.INSERT,
    }
  );
};

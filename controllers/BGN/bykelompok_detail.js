import * as cheerio from "cheerio";
import fs from "fs/promises";
import db from "../../config/Database135MBG.js";
import axios from "axios";
import ioServer from "../../index.js";

// Fungsi untuk kirim log ke console dan frontend via socket
const log = (msg) => {
  console.log(msg);
  ioServer.emit("bgn", msg);
};

// Fungsi bantu untuk sanitasi karakter tak terlihat
const sanitizeText = (text) =>
  text.replace(/[\u202A-\u202E\u200E\u200F]/g, "").trim();

/**
 * Ambil rekap kelompok dari dialur.bgn.go.id
 */
export const pengambilanRekapKelompok = async (cookieHeader) => {
  const dataKelompok = await db.query(
    `SELECT id_detail, tipe_detail, name FROM data_bgn.by_kelompok`,
    {
      type: db.QueryTypes.SELECT,
    }
  );

  const hasilArray = [];

  for (const item of dataKelompok) {
    const payload = new URLSearchParams({
      id: item.id_detail,
      token: "...",
      mode: item.tipe_detail,
      ProvKode: "0",
    });

    log(`🔗 Mengambil data kelompok: ${item.name} (ID: ${item.id_detail})`);
    log(`📝 Payload: ${payload.toString()}`);

    try {
      const response = await axios.post(
        "https://dialur.bgn.go.id/Home/tampilRekapDetail",
        payload.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: cookieHeader,
          },
        }
      );

      const cleanedResponse = response.data.replace(
        /^Undefined array key 1\s*/g,
        ""
      );

      const responseData = JSON.parse(cleanedResponse);
      responseData.id_detail = item.id_detail;
      responseData.name = item.name;

      hasilArray.push(responseData);
    } catch (err) {
      log(`❌ Gagal fetch untuk ID ${item.id_detail}: ${err.message}`);
    }
  }

  log("✅ Pengambilan rekap kelompok selesai.");
  return hasilArray;
};

/**
 * Simpan hasil detail kelompok ke database
 */
export const saveByKelompokDetail = async (html, idDetail, name) => {
  log(`🔄 Memproses data untuk kelompok ${name} (id_detail: ${idDetail})`);

  const htmlListing = html.hasil.listing.replace(/Undefined array key 1/g, "");
  if (!htmlListing.trim()) {
    log(`❌ HTML kosong atau tidak valid untuk kelompok ${name}.`);
    return;
  }

  if (!htmlListing.trim().endsWith("</table>")) {
    log(`⚠️ HTML kemungkinan terpotong untuk id_detail ${idDetail}`);
    await fs.writeFile(`log_html_truncated_id_${idDetail}.html`, htmlListing);
  }

  const $ = cheerio.load(htmlListing);
  const rows = $("table.table tbody tr");

  if (rows.length === 0) {
    log(`❌ Tidak ada baris data ditemukan untuk kelompok ${name}`);
    return;
  }

  const safeText = (el) => $(el).text().trim();

  // Hapus data sebelumnya
  log(`🗑️ Menghapus data lama untuk kelompok ${name}`);
  await db.query(
    `DELETE FROM data_bgn.by_kelompok_detail WHERE id_kelompok = ?`,
    {
      replacements: [idDetail],
      type: db.QueryTypes.DELETE,
    }
  );

  for (let i = 0; i < rows.length; i++) {
    const columns = $(rows[i]).find("td");

    if (columns.length < 11) {
      log(
        `⚠️ Baris ${i + 1} memiliki kolom kurang dari 11 (hanya ${
          columns.length
        })`
      );
      continue;
    }

    try {
      const data = {
        provinsi: safeText(columns[1]),
        kabKota: safeText(columns[2]),
        kecamatan: safeText(columns[3]),
        kelurahanDesa: safeText(columns[4]),
        namaSPPG: safeText(columns[5]),
        jenisSPPG: safeText(columns[6]),
        namaKaSPPG: safeText(columns[7]),
        noTelepon: sanitizeText(safeText(columns[8]).replace("`", "")),
        jenisKelompok: safeText(columns[9]) || "N/A",
        namaKelompok: safeText(columns[10]) || "N/A",
        id_kelompok: idDetail,
      };

      await db.query(
        `INSERT INTO data_bgn.by_kelompok_detail 
         (provinsi, kabKota, kecamatan, kelurahanDesa, namaSPPG, jenisSPPG, namaKaSPPG, noTelepon, jenisKelompok, namaKelompok, id_kelompok)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: Object.values(data),
          type: db.QueryTypes.INSERT,
        }
      );
    } catch (error) {
      log(
        `❌ Gagal simpan baris ${i + 1} (${name}, id_detail: ${idDetail}): ${
          error.message
        }`
      );
    }
  }

  log(`✅ Selesai simpan semua data untuk kelompok ${name}`);
};

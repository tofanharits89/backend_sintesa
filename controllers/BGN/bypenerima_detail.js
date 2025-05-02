import * as cheerio from "cheerio";
// import db from "../config/Database135MBG.js";
import db from "../../config/Database135MBG.js";
import axios from "axios";
import ioServer from "../../index.js"; // Mengimpor ioServer untuk emit log

// Fungsi untuk mengirim log ke frontend
const log = (msg) => {
  console.log(msg);
  ioServer.emit("bgn", msg); // Emit log ke frontend
};

// Ambil data rekap penerima dari URL
export const pengambilanRekapPenerima = async (cookieHeader) => {
  const dataPenerima = await db.query(
    `SELECT id_detail, tipe_detail,name FROM data_bgn.by_penerima`,
    {
      type: db.QueryTypes.SELECT,
    }
  );
  const hasilArray = [];

  for (const item of dataPenerima) {
    const payload = new URLSearchParams({
      id: item.id_detail,
      token: "...",
      mode: item.tipe_detail,
      ProvKode: "0",
    });

    log(`🔗 Mengambil data penerima: ${item.name} (ID: ${item.id_detail})`);
    log(`📝 Payload yang dikirim: ${payload.toString()}`);

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

      // Pembersihan string error sebelum diproses
      let cleanedResponse = response.data.replace(
        /^Undefined array key 1\s*/g,
        ""
      );

      // Menambahkan id_detail ke dalam response yang dikembalikan
      const responseData = JSON.parse(cleanedResponse);
      responseData.id_detail = item.id_detail;
      responseData.name = item.name;

      hasilArray.push(responseData);
    } catch (err) {
      log(`❌ Gagal fetch untuk id: ${item.id_detail} - ${err.message}`);
    }
  }

  log("✅ Pengambilan rekap penerima selesai.");
  return hasilArray;
};

export const saveByPenerimaDetail = async (html, idDetail, name) => {
  log(`🔄 Memproses data untuk penerima ${name} dengan id_detail: ${idDetail}`);
  const htmlListing = html.hasil.listing.replace(/Undefined array key 1/g, "");
  if (!htmlListing.trim()) {
    log(`❌ HTML 'listing' kosong atau tidak valid untuk penerima ${name}.`);
    return;
  }

  if (!htmlListing.trim().endsWith("</table>")) {
    log(`⚠️ HTML kemungkinan terpotong untuk id_detail ${idDetail}`);
    await fs.writeFile(`log_html_truncated_id_${idDetail}.html`, htmlListing);
  }

  const $ = cheerio.load(htmlListing);
  const rows = $("table.table tbody tr");

  if (rows.length === 0) {
    log(`❌ Tidak ada baris data ditemukan untuk penerima ${name}`);
    return;
  }

  const safeText = (el) => $(el).text().trim();
  const safeInt = (el) => parseInt($(el).text().replace(/[^\d]/g, ""), 10) || 0;

  // Hapus data yang ada untuk id_detail yang sama terlebih dahulu
  log(`🔄 Menghapus data yang ada untuk penerima ${name}`);
  await db.query(
    `DELETE FROM data_bgn.by_penerima_detail WHERE id_penerima = ?`,
    {
      replacements: [idDetail],
      type: db.QueryTypes.DELETE,
    }
  );

  // Loop through each row and insert data
  for (let i = 0; i < rows.length; i++) {
    const columns = $(rows[i]).find("td");

    if (columns.length < 14) {
      log(
        `⚠️ Baris ke-${i + 1} memiliki kolom kurang dari 14. Kolom: ${
          columns.length
        }`
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
        noTelepon: safeText(columns[8]).replace("`", ""),
        jenisKelompok: safeText(columns[9]) || "N/A",
        namaKelompok: safeText(columns[10]) || "N/A",
        pria: safeInt(columns[11]),
        wanita: safeInt(columns[12]),
        jumlah: safeInt(columns[13]),
        id_penerima: idDetail,
      };

      // Insert the new data after deleting the previous data
      await db.query(
        `INSERT INTO data_bgn.by_penerima_detail 
          ( provinsi, kabKota, kecamatan, kelurahanDesa, namaSPPG, jenisSPPG, namaKaSPPG, noTelepon, jenisKelompok, namaKelompok, pria, wanita, jumlah, id_penerima)
          VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: Object.values(data),
          type: db.QueryTypes.INSERT,
        }
      );
    } catch (error) {
      log(
        `❌ Gagal simpan baris ${
          i + 1
        } untuk penerima ${name} (id_detail: ${idDetail}): ${error.message}`
      );
    }
  }

  log(`✅ Semua data berhasil diproses untuk penerima ${name}`);
};

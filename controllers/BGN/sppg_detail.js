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

// Ambil data rekap SPPG dari URL
export const pengambilanSPPGDetail = async (cookieHeader) => {
  const dataWilayah = await db.query(
    `SELECT WilKode, WilNama,name FROM data_bgn.data_sppg`,
    {
      type: db.QueryTypes.SELECT,
    }
  );
  const hasilArray = [];

  for (const item of dataWilayah) {
    const payload = new URLSearchParams({
      wilKode: item.WilKode,
      token: "...",
      wilLevel: "1",
      mode: "jumlah",
      tanggal: "",
    });

    log(
      `🔗 Mengambil data SPPG untuk wilayah ${item.WilNama} (Kode: ${item.WilKode})`
    );
    log(`📝 Payload yang dikirim: ${payload.toString()}`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await axios.post(
        "https://dialur.bgn.go.id/RekapMitraOpsnal/tampilRekapDetail",
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

      // Menambahkan wilKode ke dalam response yang dikembalikan
      const responseData = JSON.parse(cleanedResponse);
      responseData.wilKode = item.WilKode;
      responseData.wilNama = item.WilNama;
      log(`🔄 Memproses data untuk SPPG wilayah ${item.WilNama}`);
      hasilArray.push(responseData);
    } catch (err) {
      log(`❌ Gagal fetch untuk kode wilayah ${item.WilKode}: ${err.message}`);
    }
  }

  log("✅ Pengambilan SPPG detail selesai.");
  return hasilArray;
};

export const saveSPPGDetail = async (html, idDetail, name) => {
  log(`🔄 Memproses data untuk SPPG ${name} dengan id_detail: ${idDetail}`);

  const htmlListing = html.hasil.detail.replace(/Undefined array key 1/g, "");
  if (!htmlListing.trim()) {
    log(`❌ HTML 'listing' kosong atau tidak valid untuk ${name}`);
    return;
  }

  if (!htmlListing.trim().endsWith("</table>")) {
    log(`⚠️ HTML kemungkinan terpotong untuk id_detail ${idDetail}`);
    await fs.writeFile(`log_html_truncated_id_${idDetail}.html`, htmlListing);
  }

  const $ = cheerio.load(htmlListing);
  const rows = $("table.table tbody tr");

  if (rows.length === 0) {
    log(`❌ Tidak ada baris data ditemukan untuk SPPG ${name}`);
    return;
  }

  const safeText = (el) => $(el).text().trim();
  const safeInt = (el) => parseInt($(el).text().replace(/[^\d]/g, ""), 10) || 0;

  // Loop through each row and insert data
  for (let i = 0; i < rows.length; i++) {
    const columns = $(rows[i]).find("td");

    // Pastikan baris memiliki cukup kolom sesuai dengan struktur yang ada
    if (columns.length < 47) {
      log(
        `⚠️ Baris ke-${i + 1} memiliki kolom kurang dari 47. Kolom: ${
          columns.length
        }`
      );
      continue;
    }

    try {
      const data = {
        provinsi_sppg: safeText(columns[1]),
        kab_kota_sppg: safeText(columns[2]),
        kecamatan_sppg: safeText(columns[3]),
        kelurahan_desa_sppg: safeText(columns[4]),
        alamat_dapur_sppg: safeText(columns[5]),
        kode_pos_sppg: safeText(columns[6]),
        tautan_lokasi_sppg: safeText(columns[7]),
        nama_sppg: safeText(columns[8]),
        jenis: safeText(columns[9]),
        tanggal_opsnal: safeText(columns[10]),
        nama_kepala_sppg: safeText(columns[11]),
        nomor_ktp_kepala_sppg: safeText(columns[12]),
        nomor_hp_kepala_sppg: safeText(columns[13]),
        email_kepala_sppg: safeText(columns[14]),
        nama_yayasan: safeText(columns[15]),
        kode_pos_yayasan: safeText(columns[16]),
        alamat_yayasan: safeText(columns[17]),
        kelurahan_desa_yayasan: safeText(columns[18]),
        kecamatan_yayasan: safeText(columns[19]),
        kab_kota_yayasan: safeText(columns[20]),
        provinsi_yayasan: safeText(columns[21]),
        nama_ketua_yayasan: safeText(columns[22]),
        nama_bank_yayasan: safeText(columns[23]),
        kode_bank: safeText(columns[24]),
        nomor_rekening_yayasan: safeText(columns[25]),
        nama_pemilik_rekening_yayasan: safeText(columns[26]),
        npwp_yayasan: safeText(columns[27]),
        nama_perwakilan_yayasan_dapur_sppg: safeText(columns[28]),
        nomor_ktp_perwakilan_yayasan: safeText(columns[29]),
        nomor_hp_perwakilan_yayasan: safeText(columns[30]),
        email_perwakilan_yayasan: safeText(columns[31]),
        balita: safeInt(columns[32]),
        paud: safeInt(columns[33]),
        ra: safeInt(columns[34]),
        tk: safeInt(columns[35]),
        sd_1_3: safeInt(columns[36]),
        sd_4_6: safeInt(columns[37]),
        mi_1_3: safeInt(columns[38]),
        mi_4_6: safeInt(columns[39]),
        smp: safeInt(columns[40]),
        mts: safeInt(columns[41]),
        sma: safeInt(columns[42]),
        smk: safeInt(columns[43]),
        ma: safeInt(columns[44]),
        mak: safeInt(columns[45]),
        slb: safeInt(columns[46]),
      };

      // Insert the new data after deleting the previous data
      await db.query(
        `INSERT INTO data_bgn.data_sppg_detail 
          (provinsi_sppg, kab_kota_sppg, kecamatan_sppg, kelurahan_desa_sppg, alamat_dapur_sppg, kode_pos_sppg, tautan_lokasi_sppg, nama_sppg, jenis, tanggal_opsnal, nama_kepala_sppg, nomor_ktp_kepala_sppg, nomor_hp_kepala_sppg, email_kepala_sppg, nama_yayasan, kode_pos_yayasan, alamat_yayasan, kelurahan_desa_yayasan, kecamatan_yayasan, kab_kota_yayasan, provinsi_yayasan, nama_ketua_yayasan, nama_bank_yayasan, kode_bank, nomor_rekening_yayasan, nama_pemilik_rekening_yayasan, npwp_yayasan, nama_perwakilan_yayasan_dapur_sppg, nomor_ktp_perwakilan_yayasan, nomor_hp_perwakilan_yayasan, email_perwakilan_yayasan, balita, paud, ra, tk, sd_1_3, sd_4_6, mi_1_3, mi_4_6, smp, mts, sma, smk, ma, mak, slb)
          VALUES ( ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: Object.values(data),
          type: db.QueryTypes.INSERT,
        }
      );
    } catch (error) {
      log(
        `❌ Gagal simpan baris ${
          i + 1
        } untuk SPPG ${name} (id_detail: ${idDetail}): ${error.message}`
      );
    }
  }

  log(`✅ Semua data berhasil diproses untuk SPPG ${name}`);
};

// Hapus detail SPPG
export const hapusDetail = async () => {
  log("🧹 Menghapus data lama SPPG detail...");
  // ⛔ Truncate sekali saja
  await db.query(`TRUNCATE TABLE data_bgn.data_sppg_detail`);
  log("✅ Data SPPG detail berhasil dihapus.");
};

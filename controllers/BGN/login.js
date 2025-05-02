// [Tetap] imp
import puppeteer from "puppeteer";
import { QueryTypes } from "sequelize";
import {
  saveByJenis,
  saveByKelompok,
  saveByKemarin,
  saveByMitra,
  saveByPenerima,
  saveByPetugas,
  saveBySekarang,
  saveBySupplier,
  saveDataBGNUtama,
  saveUpdate,
} from "./simpanData.js";
import {
  pengambilanRekapKelompok,
  saveByKelompokDetail,
} from "./bykelompok_detail.js";
import {
  pengambilanRekapPenerima,
  saveByPenerimaDetail,
} from "./bypenerima_detail.js";
import {
  hapusDetail,
  pengambilanSPPGDetail,
  saveSPPGDetail,
} from "./sppg_detail.js";
import ioServer from "../../index.js";
import db from "../../config/Database135MBG.js";

// ====================== Helper Emit + Log ======================
const log = (msg) => {
  console.log(msg);
  ioServer.emit("bgn", msg);
};

// ====================== Cookie Utils ======================
const checkCookieValidity = async () => {
  log("🔍 Mengecek validitas cookie dari database...");
  const [cookie] = await db.query(
    "SELECT * FROM data_bgn.cookies ORDER BY created_at DESC LIMIT 1",
    { type: QueryTypes.SELECT }
  );

  if (!cookie) {
    log("⚠️  Tidak ada cookie yang tersimpan.");
    return null;
  }

  const now = new Date();
  if (new Date(cookie.expiration_date) > now) {
    log("✅ Cookie masih valid.");
    return cookie.cookie_value;
  }

  log("⚠️  Cookie sudah kadaluarsa. Menghapus dari database...");
  await db.query("TRUNCATE data_bgn.cookies", {
    replacements: [cookie.id],
    type: QueryTypes.DELETE,
  });

  return null;
};

const loginAndSaveCookie = async () => {
  log("🔐 Login ke server BGN dan menyimpan cookie baru...");
  const LOGIN_URL = "https://dialur.bgn.go.id/Sign";
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  await page.goto(LOGIN_URL, { waitUntil: "domcontentloaded" });
  const csrfToken = await page.$eval("#csrf_token", (el) => el.value);
  await page.type('input[name="username"]', "avviz@kemenkeu.go.id");
  await page.type('input[name="password"]', "kemenkeu123!@");
  await page.evaluate((csrf) => {
    document.querySelector('input[name="csrf_token"]').value = csrf;
  }, csrfToken);

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  const cookieHeader = (await page.cookies())
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);

  await db.query(
    "INSERT INTO data_bgn.cookies (cookie_value, expiration_date) VALUES (?, ?)",
    {
      replacements: [cookieHeader, expiration],
      type: QueryTypes.INSERT,
    }
  );

  await browser.close();
  log("✅ Login sukses & cookie disimpan.");
  log("🧾 Cookie baru yang disimpan: " + cookieHeader);
  return cookieHeader;
};

// ====================== Request Util ======================
const fetchDataFromBGN = async (cookieHeader) => {
  log("🌐 Mengambil data dari server BGN...");
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const cookies = cookieHeader.split(";").map((item) => {
    const [name, value] = item.trim().split("=");
    return { name, value, domain: "dialur.bgn.go.id" };
  });
  await page.setCookie(...cookies);

  await page.goto("https://dialur.bgn.go.id/Home", {
    waitUntil: "networkidle2",
  });

  if (page.url().includes("/Sign")) {
    log("🚫 Redirect ke halaman login. Cookie tidak valid.");
    throw new Error("Redirected to login. Cookie invalid.");
  }

  const responseText = await page.evaluate(async () => {
    const formData = new URLSearchParams({
      token: "bgnOYE==",
      RoleID: "16",
      RoleTipe: "5",
      ProvKode: "0",
    });

    const res = await fetch("/Home/tampilDataAngka", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    return await res.text();
  });

  await browser.close();

  try {
    const parsed = JSON.parse(responseText);
    log("✅ Data berhasil diambil dari BGN.");
    return parsed;
  } catch {
    log("⚠️  Gagal parsing data. Respon bukan JSON.");
    throw new Error("Server returned HTML instead of JSON.");
  }
};

// ====================== Main Entry ======================
export const getDataBGN = async (req, res) => {
  const { passkey, username } = req.body;

  if (!passkey) {
    return res.status(400).json({ message: "Passkey harus diisi." });
  }

  const validPasskey = "170845";

  if (passkey !== validPasskey) {
    return res.status(401).json({ message: "Passkey tidak valid." });
  }

  if (!username) {
    return res.status(400).json({ message: "Username harus dikirim." });
  }

  try {
    log("🚀 Memulai proses pengambilan data dari BGN...");

    let cookie = await checkCookieValidity();
    let data;

    try {
      if (!cookie) {
        log("🔄 Login ulang karena cookie tidak valid atau tidak ada.");
        cookie = await loginAndSaveCookie();
      }
      data = await fetchDataFromBGN(cookie);
    } catch (err) {
      if (err.message.includes("Cookie invalid")) {
        log("🔄 Cookie ternyata tidak valid. Melakukan login ulang...");
        cookie = await loginAndSaveCookie();
        data = await fetchDataFromBGN(cookie);
      } else {
        throw err;
      }
    }

    log("💾 Menyimpan data SPPG ...");
    await saveDataBGNUtama(cookie);

    log("🔍 Mengambil data SPPG detail...");
    const allHtmlPenerima = await pengambilanSPPGDetail(cookie);
    await hapusDetail();
    for (const htmlpenerima of allHtmlPenerima) {
      const idDetail = htmlpenerima.wilKode;
      const name = htmlpenerima.wilNama;
      log(`💾 Menyimpan detail sppg untuk ${name} (${idDetail})`);
      await saveSPPGDetail(htmlpenerima, idDetail, name);
    }

    log("💾 Menyimpan data by_jenis...");
    await saveByJenis(data.hasil.by_jenis.rinci);

    log("💾 Menyimpan data by_kelompok...");
    await saveByKelompok(data.hasil.by_kelompok.rinci);

    log("💾 Menyimpan data by_petugas...");
    await saveByPetugas(data.hasil.by_petugas.rinci);

    log("💾 Menyimpan data by_supplier...");
    await saveBySupplier(data.hasil.by_supplier.rinci);

    log("💾 Menyimpan data by_mitra...");
    await saveByMitra(data.hasil.by_mitra.rinci);

    log("💾 Menyimpan data by_sekarang...");
    await saveBySekarang(data.hasil.by_sekarang);

    log("💾 Menyimpan data by_kemarin...");
    await saveByKemarin(data.hasil.by_kemarin);

    log("💾 Menyimpan data by_penerima...");
    await saveByPenerima(data.hasil.by_penerima.rinci);

    log("🔍 Mengambil rekap kelompok detail...");
    const allHtml = await pengambilanRekapKelompok(cookie);
    for (const html of allHtml) {
      const idDetail = html.id_detail;
      const name = html.name;
      log(`💾 Menyimpan detail by_kelompok untuk ID: ${idDetail}`);
      await saveByKelompokDetail(html, idDetail, name);
    }

    log("🔍 Mengambil rekap penerima detail...");
    const allHtmlPenerimaRekap = await pengambilanRekapPenerima(cookie);
    for (const htmlpenerima of allHtmlPenerimaRekap) {
      const idDetail = htmlpenerima.id_detail;
      const name = htmlpenerima.name;
      log(`💾 Menyimpan detail by_penerima untuk ${name} (${idDetail})`);
      await saveByPenerimaDetail(htmlpenerima, idDetail, name);
    }

    log("💾 Menyimpan data update...");
    await saveUpdate(username);

    log("✅ Semua data berhasil diambil dan disimpan.");
    log("🎉 PROSES SELESAI 🎉");
    return res.status(200).json({ message: "Data berhasil diupdate" });
  } catch (err) {
    log("❌ Terjadi kesalahan saat proses: " + err.message);
    return res
      .status(500)
      .json({ message: "Gagal mengambil data", error: err.message });
  }
};

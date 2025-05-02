import express from "express";
import {
  Aktifasi,
  getUserbyId,
  hapusUser,
  hapusquery,
  simpanUser,
  simpanquery,
  ubahPassword,
  ubahUser,
  ubahUserProfile,
} from "../controllers/Userv3.js";
import {
  getUsers,
  Register,
  Login,
  Logout,
  editUser,
  checkUser,
  deleteUser,
} from "../controllers/Users.js";
import { getLibur, hapusLibur, insertLibur } from "../controllers/Libur.js";

import { errorHandler, verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

import {
  chart,
  inquiry,
  inquirycsv,
  tgupdate,
  randomQuery,
  inquiryBelanja,
  randomQueryTematik,
  randomQueryTematikApbd,
  randomQueryBansos,
  randomQueryDeviasi,
  inquiryApbn,
  randomQueryBulanan,
  randomQueryAkumulasi,
  randomQueryBlokir,
  randomQueryJnsblokir,
  randomQueryKontrak,
  randomQueryRkakl,
  randomQueryUp,
  randomQuerySP2D,
  randomQueryRevisi,
  randomQuerySpending,
  randomQueryPenerimaan,
  inquirycsvtkd,
} from "../controllers/MEBE/Inquiry.js";
import { inquiryrkakl } from "../controllers/MEBE/Inquiryrkakl.js";
import {
  getMode,
  getSetting,
  log_menu,
  ubahSetting,
} from "../controllers/Setting.js";
import { CekLogin } from "../controllers/CekLogin.js";
import { simpanHarmon, HarmonisasiQuery } from "../controllers/Harmonisasi.js";
import {
  SimpanDispensasi,
  SimpanDispensasiKontrak,
  SimpanDispensasiTup,
  SimpanLampiranKontrak,
  SimpanLampiranTup,
  SimpanSPM,
  SimpanUploadKontrak,
  SimpanUploadSPM,
  SimpanUploadTup,
  cariSatker,
  dispkontrak,
  dispspm,
  disptup,
  downloadFileDispen,
  downloadFileDispenKontrak,
  downloadFileDispenTup,
  hapuskontrak,
  hapusspm,
  hapustup,
  tayangDispensasi,
  tayangKontrak,
  tayangTup,
  tayangMonitoring,
} from "../controllers/Dispensasi_Controller.js";
import { uploadImage } from "../controllers/Bug.js";
import {
  Dau_KMK,
  Ref_Dau,
  RekonOmspan,
  SimpanKMK,
  SimpanKMKCabut,
  SimpanKMKJENIS3,
  SimpanPencabutan,
  SimpanPenundaan,
  endpointRekon,
  generateData,
  generateDataRekon,
  hapuskmk,
  hapuspenundaan,
  hapuspotongan,
} from "../controllers/Dau/Dau_Controller.js";
import {
  Ref_Data_Mysql,
  getColumnsOfTable,
  getDatabases,
  getTables,
} from "../controllers/Referensi/getData.js";
import {
  getDataOracle,
  getTableOracle,
} from "../controllers/DataOracle/getDataOracle.js";
import { getUpload, hapusupload } from "../controllers/UploadKPPN/getUpload.js";
import {
  getUploadKanwil,
  hapusuploadkanwil,
} from "../controllers/UploadKanwil/getUploadKanwil.js";
import {
  deleteData,
  simpanPemotongan,
  simpanPenundaan,
  updaterekon,
} from "../controllers/Dau/Omspan_Contoller.js";
import {
  chartKinerja,
  dataTkd,
  getDataKinerja,
  hapusikpa,
  hapusoutput,
  hapustemuan,
  simpanIkpa,
  simpanIsu,
  simpanOutput,
  simpanTemuan,
  simpanTren,
} from "../controllers/Kinerja/Kinerja_Controller.js";
import {
  hapusikpacluster,
  hapusoutputcluster,
  hapustemuanCluster,
  simpanIkpaCluster,
  simpanIsuCluster,
  simpanOutputCluster,
  simpanTemuanCluster,
  simpanTrenCluster,
} from "../controllers/Kinerja/Kinerja_Controller_Cluster.js";
import {
  sendBug,
  simpanNotifikasi,
  ubahStatus,
  ubahStatusOnline,
} from "../controllers/Notifikasi/Notifikasi_Controller.js";
import {
  dataSpending,
  hapusEinmaligh,
  hapusInefisiensi,
  simpanEinmlaigh,
  simpanInefisiensi,
  ubahStatusSatker,
} from "../controllers/Spending/SpendingController.js";
import { TpidQuery, simpanTpid } from "../controllers/Permasalahan_Tpid.js";
import {
  editProyeksi,
  hapusProyeksi,
  simpanProyeksi,
} from "../controllers/Proyeksi/ProyeksiController.js";
import { simpanIku, simpanIkuKPPN } from "../controllers/Iku/IkuController.js";
import {
  hapusDetailkontrakKPPN,
  hapusKontrakKPPN,
  SimpanDispensasiKPPN,
  SimpanLampiranKontrakKPPN,
  tayangDispensasiKPPN,
} from "../controllers/DispensasiKPPN/DispensasiKPPN_Controller.js";
import { downloadADK } from "../controllers/DownloadADK.js";
import {
  downloadFileWR,
  hapuswr,
  WeeklyUpload,
} from "../controllers/Weekly/WeeklyController.js";
import {
  ChatGPT,
  fineTuneUpload,
  listFineTunes,
  statusFineTunes,
} from "../controllers/GPT/chat.js";
import { AktifOTP, Simpan_LogBOT } from "../controllers/AktifasiOTP/otp.js";
import { LoginPIN } from "../controllers/LoginPin/LoginPin.js";
import {
  getChatFlowise,
  getChatFlowiseDetail,
  Simpan_Api,
  Simpan_ChatFlowise,
} from "../controllers/GPT/flowise.js";
import { queryVectara } from "../controllers/Vectara/vectaraController.js";

import {
  tayangMonitoringBlokir,
  tayangMonitoringBlokirSatker,
  editDispenBlokir,
} from "../controllers/Monitoring_Blokir.js";
// import { updateTkd } from "../controllers/tarikDataTkd/index.js";
import {
  tayangMonevPnbp,
  updateMonevPnbp,
  updateLapPnbp,
  getRekamanNotaDinas,
  getRekaman,
} from "../controllers/MonevPnbp_Controller.js";
import { getDataBGN } from "../controllers/BGN/login.js";
import {
  getTableMbg,
  hapusKomoditas,
  simpanKomoditas,
} from "../controllers/BGN/MbgControllers.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.get("/cekusers", verifyToken, checkUser);
router.delete("/users/:id", verifyToken, deleteUser);
router.put("/users/:id", verifyToken, editUser);
router.post("/users", Register);
router.post("/login", Login);
router.post("/login/pin", LoginPIN);
router.get("/token", refreshToken);
router.delete("/logout", Logout);
//HARI LIBUR
router.get("/libur", getLibur);
router.post("/libur", verifyToken, insertLibur);
router.delete("/libur/:id", verifyToken, hapusLibur);
// MEBE
router.get("/inquiryrkakl/", inquiryrkakl);
router.get("/inquiry/", verifyToken, inquiry);
router.get("/inquirybulanan/", verifyToken, randomQueryBulanan);
router.get("/inquirybelanja/", verifyToken, inquiryBelanja);
router.get("/inquiryakumulasi/", verifyToken, randomQueryAkumulasi);
router.get("/inquiryblokir/", verifyToken, randomQueryBlokir);
router.get("/inquiryjnsblokir/", verifyToken, randomQueryJnsblokir);
router.get("/inquirycsv/", verifyToken, inquirycsv);
router.get("/tgupdate", verifyToken, tgupdate);

router.get("/chart/", verifyToken, chart);
router.get("/getData/", verifyToken, randomQuery);

router.get("/getDataTematik/", verifyToken, randomQueryTematik);
router.get("/getDataTematikApbd/", verifyToken, randomQueryTematikApbd);
router.get("/getDataBansos/", verifyToken, randomQueryBansos);
router.get("/getDataDeviasi/", verifyToken, randomQueryDeviasi);
router.get("/getDataKontrak/", verifyToken, randomQueryKontrak);
router.get("/getDataPenerimaan/", verifyToken, randomQueryPenerimaan);
router.get("/getDataRkakl/", verifyToken, randomQueryRkakl);
router.get("/getDataUp/", verifyToken, randomQueryUp);
router.get("/getDataRevisi/", verifyToken, randomQueryRevisi);
router.get("/getDataBlokir/", verifyToken, randomQueryBlokir);
router.get("/getDataJnsblokir/", verifyToken, randomQueryJnsblokir);

router.post("/register/user", verifyToken, simpanUser);
router.patch("/user/edit/:id", verifyToken, ubahUser);
router.patch("/user/editprofile/:id", verifyToken, ubahUserProfile);
router.patch("/user/editpassword/:id", verifyToken, ubahPassword);
router.delete("/user/delete/:id", verifyToken, hapusUser);
router.post("/user/simpanquery", verifyToken, simpanquery);
router.delete("/query/delete/:id", verifyToken, hapusquery);
router.get("/user/getuser", verifyToken, getUserbyId);
router.patch("/user/aktifasi", Aktifasi);
router.patch("/admin/setting", verifyToken, ubahSetting);
router.get("/admin/data/setting", verifyToken, getSetting);
router.get("/admin/data/logmenu", verifyToken, log_menu);
//inquiry belanja apbn
router.get("/getDataApbn/", verifyToken, inquiryApbn);
router.get("/getDataSP2D/", verifyToken, randomQuerySP2D);
//cek login
router.get("/ceklogin/", CekLogin);
router.get("/cekmode/", getMode);
// simpan data harmonisasi
router.patch("/simpanHarmonisasi/", verifyToken, simpanHarmon);
router.get("/harmonisasi/", verifyToken, HarmonisasiQuery);
// simpan data tpid
router.patch("/simpanTpid/", verifyToken, simpanTpid);
router.get("/tpid/", verifyToken, TpidQuery);

router.post("/simpanDispensasi/", verifyToken, SimpanDispensasi);
router.get("/tayangDispensasi/", verifyToken, tayangDispensasi);
router.get("/tayangMonitoring/", verifyToken, tayangMonitoring);
router.post("/simpanSPM/", verifyToken, SimpanSPM);
router.delete("/spm/delete/:id/:id_dispensasi", verifyToken, hapusspm);
router.delete("/dispspm/delete/:id", verifyToken, dispspm);
router.get("/cariSatker/", verifyToken, cariSatker);

router.get("/tayangKontrak/", verifyToken, tayangKontrak);
router.post("/simpanKontrak/", verifyToken, SimpanDispensasiKontrak);
router.post("/simpanLampiranKontrak/", verifyToken, SimpanLampiranKontrak);
router.delete("/kontrak/delete/:id/:id_dispensasi", verifyToken, hapuskontrak);
router.delete("/dispkontrak/delete/:id", verifyToken, dispkontrak);

router.get("/tayangTup/", verifyToken, tayangTup);
router.post("/simpanTup/", verifyToken, SimpanDispensasiTup);
router.post("/simpanLampiranTup/", verifyToken, SimpanLampiranTup);
router.delete("/tup/delete/:id/:id_dispensasi", verifyToken, hapustup);
router.delete("/disptup/delete/:id", verifyToken, disptup);

// Monev PNBP
router.get("/tayangMonevPnbp/", verifyToken, tayangMonevPnbp);
router.patch("/updateMonevPnbp/edit", verifyToken, updateMonevPnbp);
router.patch("/updateLapPnbp/edit", verifyToken, updateLapPnbp);
router.get("/getRekamanNotaDinas/", verifyToken, getRekamanNotaDinas);
router.get("/getRekaman/", verifyToken, getRekaman);

router.get("/getData/TKD/DAU/", verifyToken, Dau_KMK);
router.get("/getData/TKD/DAU/Referensi/", verifyToken, Ref_Data_Mysql);
router.get("/getData/TKD/DAU/Referensi/tkd", verifyToken, Ref_Dau);
router.post("/simpanKMK/", verifyToken, SimpanKMK);
router.post("/simpanKMKJENIS3/", verifyToken, SimpanKMKJENIS3);
router.post("/simpanKMKCabut/", verifyToken, SimpanKMKCabut);
router.post("/simpanPenundaan/", verifyToken, SimpanPenundaan);
router.post("/simpanPencabutan/", verifyToken, SimpanPencabutan);
router.delete("/dau/potongan/delete/:id", verifyToken, hapuspotongan);
router.delete("/dau/kmk/delete/:id", verifyToken, hapuskmk);
router.delete("/dau/penundaan/delete/:id", verifyToken, hapuspenundaan);
router.get("/dau/kertaskerja/generateData/", verifyToken, generateData);
router.get(
  "/dau/kertaskerja/generateDataRekon/",
  verifyToken,
  generateDataRekon
);

// Tayang Monitoring Blokir
router.get("/tayangMonitoringBlokir/", verifyToken, tayangMonitoringBlokir);
router.get(
  "/tayangMonitoringBlokirSatker/",
  verifyToken,
  tayangMonitoringBlokirSatker
);
router.patch("/editDispenBlokir/edit", verifyToken, editDispenBlokir);

//REFERENSI
router.get(
  "/getData/referensi/db/oracle",
  verifyToken,
  errorHandler,
  getDataOracle
);
router.get(
  "/getData/referensi/table/oracle/:selectedDatabase",
  verifyToken,
  errorHandler,
  getTableOracle
);
router.get("/getData/referensi/db", verifyToken, getDatabases);
router.get(
  "/getData/referensi/table/:selectedDatabase",
  verifyToken,
  getTables
);
router.get(
  "/getData/referensi/column/:selectedDatabase/:selectedTable",
  verifyToken,
  getColumnsOfTable
);
router.get(
  "/dau/kertaskerja/generateDataRekonOMSPAN/",
  verifyToken,
  RekonOmspan
);
router.get("/api/dau/rekon/", verifyToken, endpointRekon);

//UPLOAD LAPORAN KPPN
router.post("/uploadKppn/", verifyToken, getUpload);
router.delete("/uploadKppn/delete/:id", verifyToken, hapusupload);

//UPLOAD LAPORAN KANWIL
router.post("/uploadKanwil/", verifyToken, getUploadKanwil);
router.delete("/uploadKanwil/delete/:id", verifyToken, hapusuploadkanwil);

// SIMPAN DATA OMSPAN TKD
router.post("/dau/simpanPemotongan", verifyToken, simpanPemotongan);
router.post("/dau/simpanPenundaan", verifyToken, simpanPenundaan);
router.delete("/dau/deleteData", verifyToken, deleteData);
router.get("/dau/updaterekon", verifyToken, updaterekon);

// SIMPAN DATA KINERJA KL
router.post("/kinerja/simpanisu", verifyToken, simpanIsu);
router.post("/kinerja/simpantren", verifyToken, simpanTren);
router.post("/kinerja/simpantemuanbpk", verifyToken, simpanTemuan);
router.get("/kinerja/getDataKinerja", verifyToken, getDataKinerja);
router.get("/kinerja/chart", verifyToken, chartKinerja);
router.delete("/kinerja/hapustemuan/:id_temuan", verifyToken, hapustemuan);
router.delete("/kinerja/hapusoutput/:id_output", verifyToken, hapusoutput);
router.delete("/kinerja/hapusikpa/:id", verifyToken, hapusikpa);

router.post("/kinerja/simpanoutput", verifyToken, simpanOutput);
router.post("/kinerja/simpanIkpa", verifyToken, simpanIkpa);

// SIMPAN DATA CLUSTER KL
router.post("/kinerja/simpanisu_cluster", verifyToken, simpanIsuCluster);
router.post("/kinerja/simpantren_cluster", verifyToken, simpanTrenCluster);
router.post("/kinerja/simpanoutput_cluster", verifyToken, simpanOutputCluster);
router.delete(
  "/kinerja/hapusoutput_cluster/:id_output",
  verifyToken,
  hapusoutputcluster
);

router.post(
  "/kinerja/simpantemuanbpk_cluster",
  verifyToken,
  simpanTemuanCluster
);
router.get("/kinerja/getDataKinerja", verifyToken, getDataKinerja);
router.get("/kinerja/chart", verifyToken, chartKinerja);
router.delete(
  "/kinerja/hapustemuan_cluster/:id_temuan",
  verifyToken,
  hapustemuanCluster
);

router.delete("/kinerja/hapusikpa_cluster/:id", verifyToken, hapusikpacluster);

router.post("/kinerja/simpanoutput", verifyToken, simpanOutput);
router.post("/kinerja/simpanIkpa_cluster", verifyToken, simpanIkpaCluster);

// NOTIFIKASI
router.post("/notifikasi/simpan", verifyToken, simpanNotifikasi);
router.patch("/notifikasi/ubahstatus/:id", verifyToken, ubahStatus);
router.patch(
  "/notifikasi/ubahstatusonline/:username/:isConnected",
  verifyToken,
  ubahStatusOnline
);

router.post("/sendBug/", verifyToken, sendBug);

// SPENDING REVIEW
router.get("/spending/alokasi", verifyToken, dataSpending);
router.post("/spending/simpan_inefisiensi", verifyToken, simpanInefisiensi);
router.delete(
  "/spending/inefisiensi/:id/:kdreview",
  verifyToken,
  hapusInefisiensi
);
router.get("/spending/query", verifyToken, randomQuerySpending);
router.post("/spending/simpan_einmaligh", verifyToken, simpanEinmlaigh);
router.delete("/spending/einmaligh/:id/:kdreview", verifyToken, hapusEinmaligh);
router.patch("/spending/update/:kdsatker/:flag", verifyToken, ubahStatusSatker);

// PROYEKSI
router.post("/proyeksi/simpan", verifyToken, simpanProyeksi);
router.delete("/proyeksi/hapus/:id", verifyToken, hapusProyeksi);
router.patch("/proyeksi/edit", verifyToken, editProyeksi);

// IKU
router.post("/iku/simpan", verifyToken, simpanIku);
router.post("/iku/simpan_kppn", verifyToken, simpanIkuKPPN);

// DISPENSASI KPPN
router.get("/tayangDispensasiKPPN/", verifyToken, tayangDispensasiKPPN);
router.post("/simpanDispensasiKPPN/", verifyToken, SimpanDispensasiKPPN);
router.get("/dispen/download/:id", verifyToken, downloadFileDispen);
router.get(
  "/dispenkontrak/download/:id",
  verifyToken,
  downloadFileDispenKontrak
);
router.get("/dispentup/download/:id", verifyToken, downloadFileDispenTup);

router.post(
  "/simpanLampiranKontrakKPPN/",
  verifyToken,
  SimpanLampiranKontrakKPPN
);
router.delete(
  "/dispkontrakkppn/delete/:id/:kdsatker/:kdkppn",
  verifyToken,
  hapusKontrakKPPN
);
router.delete(
  "/hapusdetailkppn/delete/:id/:kdsatker/:kdkppn/:id_dispensasi",
  verifyToken,
  hapusDetailkontrakKPPN
);
router.post("/dispensasi/uploadspm", verifyToken, SimpanUploadSPM);
router.post("/dispensasi/uploadkontrak", verifyToken, SimpanUploadKontrak);
router.post("/dispensasi/uploadtup", verifyToken, SimpanUploadTup);
router.get("/file/download_adk", verifyToken, downloadADK);

// CEK STATUS API BACKEND
router.get("/status", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// WEEKLY
router.post("/weekly/simpan", verifyToken, WeeklyUpload);
router.delete("/wr/delete/:id/:token", verifyToken, hapuswr);
router.get("/wr/download/:id", verifyToken, downloadFileWR);

// CHAT GPT
router.post("/api/gpt", ChatGPT);
router.post("/upload/tuning", verifyToken, fineTuneUpload);
router.get("/api/listtuning", listFineTunes);
router.get("/api/statustuning", statusFineTunes);

// AKTIFASI AKUN
router.patch("/otp", verifyToken, AktifOTP);
router.get("/getData/bot/landing/", verifyToken, Dau_KMK);
router.post("/bot/simpan/", verifyToken, Simpan_LogBOT);

// CHAT FLOWISE AI
router.get("/getChat/", getChatFlowise);
router.get("/getChatDetail/", getChatFlowiseDetail);
router.post("/bot/simpanChat/", verifyToken, Simpan_ChatFlowise);
router.patch("/bot/simpanApi/", verifyToken, Simpan_Api);
// VECTARA
router.post("/api/vectara/query", queryVectara);
// Tarik TKD
router.get("/updatetkd/chart", dataTkd);
router.get("/inquirycsvtkd/", inquirycsvtkd);

// EPA
// router.patch("/epa/simpanIsu/", verifyToken, simpanIsuEP);
// BGN
router.post("/bgn/login", verifyToken, getDataBGN);
router.post("/mbg/simpanKomoditas", verifyToken, simpanKomoditas);
router.delete("/mbg/hapusKomoditas/:id/:kdkanwil", verifyToken, hapusKomoditas);
router.get("/mbg/download", verifyToken, getTableMbg);

export default router;

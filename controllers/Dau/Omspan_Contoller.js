import moment from "moment-timezone";
import Pemotongan_Model from "../../models/data_omspan/data_pemotongan.js";
import Penundaan_Model from "../../models/data_omspan/data_penundaan.js";

export const simpanPemotongan = async (req, res) => {
  // await Pemotongan_Model.truncate();
  const {
    THANG,
    PERIODE,
    GELOMBANG,
    KODE_PEMDA,
    KODE_KPPN,
    KODE_KANWIL,
    JENIS_TKD,
    NILAI_PEMOTONGAN,
    NOMOR_ND,
    COA,
    AKUN,
    TANGGAL_ND,
    NAMA_PERIODE,
    NAMA_DETAIL,
    NM_LOKASI,
  } = req.body;

  try {
    req.body = req.body.map((item) => ({
      ...item,
      THANG: "2024",
      TANGGAL_ND: moment(item.TANGGAL_ND, "DD-MM-YYYY").format("YYYY-MM-DD"),
      AKUN: item.COA ? item.COA.substring(11, 17) : "",
    }));
    await Pemotongan_Model.bulkCreate(req.body);
    res.status(201).json({
      msg: "Data Pemotongan Berhasil Disimpan",
      totalrows: req.body.length,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const simpanPenundaan = async (req, res) => {
  // await Penundaan_Model.truncate();
  const {
    THANG,
    PERIODE,
    GELOMBANG,
    KODE_PEMDA,
    JENIS_TKD,
    NILAI_PENUNDAAN,
    NOMOR_ND,
    TANGGAL_ND,
    NAMA_PERIODE,
    NAMA_DETAIL,
    NM_LOKASI,
    KODE_KPPN,
    KODE_KANWIL,
  } = req.body;

  try {
    req.body = req.body.map((item) => ({
      ...item,
      THANG: "2024",
      TANGGAL_ND: moment(item.TANGGAL_ND, "DD-MM-YYYY").format("YYYY-MM-DD"),
    }));
    await Penundaan_Model.bulkCreate(req.body);
    res.status(201).json({
      msg: "Data Penundaan Berhasil Disimpan",
      totalrowstunda: req.body.length,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" + error });
  }
};

export const deleteData = async (req, res) => {
  try {
    await Penundaan_Model.truncate();
    await Pemotongan_Model.truncate();

    res.status(200).json({ msg: "Data berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal menghapus data", error: error.message });
  }
};
export const updaterekon = async (req, res) => {
  try {
    const query = await Pemotongan_Model.findOne({
      order: [["updatedat", "DESC"]], // Mengurutkan berdasarkan updatedAt secara descending
    });

    if (!query) {
      return res.status(404).json({ msg: "Data Potongan Not Found" });
    }

    const currentDate = moment(query.updatedat).format("DD-MM-YYYY HH:mm:ss");
    console.log("Ini data update-nya: " + currentDate);

    res.json({
      tgupdate: currentDate,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

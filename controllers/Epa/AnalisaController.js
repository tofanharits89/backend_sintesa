import db from "../../config/Database3.js";
import Analisa from "../../models/EpaModel/AnalisaModel.js";

// Simpan Data ke Database
export const simpanData = async (req, res) => {
  try {
    console.log("Data diterima rekam:", req.body); // Debugging

    const {
      dataEpa,
      selectedProgram,
      selectedPoint,
      selectedSubPoint,
      selectedRo,
      tabData,
    } = req.body;

    if (!dataEpa || !tabData) {
      return res.status(400).json({
        message: "dataEpa atau tabData tidak ditemukan dalam request",
      });
    }

    const data = await Analisa.create({
      thang: dataEpa.year, // Tahun Anggaran dari dataEpa
      periode: dataEpa.period, // Periode dari dataEpa
      kddept: dataEpa.kddept, // Kode Departemen dari dataEpa
      kdkanwil: dataEpa.kodeKanwil, // Kode Kanwil dari dataEpa
      username: dataEpa.username, // Username dari dataEpa
      selectedProgram,
      selectedPoint,
      selectedSubPoint,
      selectedRo,
      kategori: JSON.stringify(tabData.tab1?.kategori || []),
      urgency: tabData.tab2?.Urgency || null, // Sesuai dengan struktur payload
      seriousness: tabData.tab2?.Seriousness || null, // Sesuai dengan struktur payload
      growth: tabData.tab2?.Growth || null, // Tidak ada field Growth dalam payload yang diberikan
      rencanaAksi: tabData.tab3?.rencanaAksi || null,
      deadline: tabData.tab3?.deadline || null,
      status: tabData.tab4?.status || null,
      approval: tabData.tab4?.approval || null,
    });

    res.status(201).json({ message: "Data berhasil disimpan", data });
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat menyimpan data" });
  }
};

// Ambil Semua Data
export const getAllData = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.*, 
        rp.nmpoint, 
        rs.nmsubpoint
      FROM epa25.analisa a
      LEFT JOIN epa25.ref_point rp ON a.selectedPoint = rp.kdpoint
      LEFT JOIN epa25.ref_subpoint rs ON a.selectedSubPoint = rs.kdsubpoint
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    res.status(500).json({ message: "Gagal mengambil data" });
  }
};

// Ambil Data Berdasarkan ID
const getDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Analisa.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data" });
  }
};

// Update Data dengan Delete lalu Insert
export const updateData = async (req, res) => {
  try {
    const {
      dataEpa,
      selectedProgram,
      selectedPoint,
      selectedSubPoint,
      selectedRo,
      tabData,
      id,
    } = req.body;

    if (!dataEpa || !tabData) {
      return res.status(400).json({
        message: "dataEpa atau tabData tidak ditemukan dalam request",
      });
    }

    // Cari data berdasarkan ID dan username
    const existingData = await Analisa.findOne({
      where: {
        id: id,
        username: dataEpa.username,
      },
    });

    if (!existingData) {
      return res
        .status(404)
        .json({ message: "Data dengan ID tersebut tidak ditemukan" });
    }

    // Hapus data lama
    await existingData.destroy();

    // Simpan data baru
    const newData = await Analisa.create({
      thang: dataEpa.year,
      periode: dataEpa.period,
      kddept: dataEpa.kddept,
      kdkanwil: dataEpa.kodeKanwil,
      username: dataEpa.username,
      selectedProgram,
      selectedPoint,
      selectedSubPoint,
      selectedRo,
      kategori: JSON.stringify(tabData.tab1?.kategori || []),
      urgency: tabData.tab2?.Urgency || null,
      seriousness: tabData.tab2?.Seriousness || null,
      growth: tabData.tab2?.Growth || null,
      rencanaAksi: tabData.tab3?.rencanaAksi || null,
      deadline: tabData.tab3?.deadline || null,
      status: tabData.tab4?.status || null,
      approval: tabData.tab4?.approval || null,
    });

    res
      .status(200)
      .json({ message: "Data berhasil diperbarui", data: newData });
  } catch (error) {
    console.error("Gagal memperbarui data:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat memperbarui data" });
  }
};

// Hapus Data Berdasarkan ID
const deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Analisa.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    await data.destroy();
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus data:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus data" });
  }
};

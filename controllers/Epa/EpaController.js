import IsuSpesifik from "../../models/EpaModel/IsuModel.js";

// ✅ Get All Data
export const getAllIsuSpesifik = async (req, res) => {
  try {
    const data = await IsuSpesifik.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Data by ID
export const getIsuSpesifikById = async (req, res) => {
  try {
    const data = await IsuSpesifik.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createIsuSpesifik = async (req, res) => {
  try {
    const { isu, data } = req.body;

    // Mapping nama bulan ke angka dengan format dua digit
    const periodOptions = [
      "Januari",
      "Pebruari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    // Validasi input
    if (
      !data ||
      !data.year ||
      !data.period ||
      !data.kodeKanwil ||
      !data.lokasiKanwil ||
      !data.kddept ||
      !data.username ||
      !isu ||
      !Array.isArray(isu) ||
      isu.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Semua field harus diisi dengan benar!" });
    }

    // Konversi periode dari nama bulan ke angka dua digit (01, 02, ..., 12)
    const monthIndex = periodOptions.indexOf(data.period);
    if (monthIndex === -1) {
      return res.status(400).json({ message: "Periode tidak valid!" });
    }
    const monthNumber = String(monthIndex + 1).padStart(2, "0");
    const key = `${data.year}${monthNumber}${data.kodeKanwil}${data.lokasiKanwil}${data.kddept}`;

    // Simpan setiap isu ke database
    const newDataArray = [];
    for (const item of isu) {
      const newEntry = await IsuSpesifik.create({
        isu: item, // Pastikan isu masuk
        thang: data.year,
        periode: monthNumber,
        kdkanwil: data.kodeKanwil,
        kdlokasi: data.lokasiKanwil,
        kdddept: data.kddept,
        username: data.username,
        keyId: key,
      });
      newDataArray.push(newEntry);
    }

    // Debugging: Cek hasil penyimpanan
    console.log("Data berhasil disimpan:", newDataArray);

    res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: newDataArray,
    });
  } catch (error) {
    console.error("Error saat menyimpan data:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Data by ID

export const EditIsuSpesifik = async (req, res) => {
  try {
    const { isu, data, keyId } = req.body;

    // Validasi input
    if (
      !data ||
      !data.year ||
      !data.period ||
      !data.kodeKanwil ||
      !data.lokasiKanwil ||
      !data.kddept ||
      !data.username ||
      !isu ||
      !keyId ||
      !Array.isArray(isu) ||
      isu.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Semua field harus diisi dengan benar!" });
    }

    // Konversi periode dari nama bulan ke angka dua digit (01, 02, ..., 12)
    const periodOptions = [
      "Januari",
      "Pebruari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const monthIndex = periodOptions.indexOf(data.period);
    if (monthIndex === -1) {
      return res.status(400).json({ message: "Periode tidak valid!" });
    }
    const monthNumber = String(monthIndex + 1).padStart(2, "0");

    const key = `${data.year}${monthNumber}${data.kodeKanwil}${data.lokasiKanwil}${data.kddept}`;

    // 🔴 **Hapus semua data terkait dengan keyId menggunakan where**
    try {
      const deletedRows = await IsuSpesifik.destroy({
        where: { keyId },
      });

      if (deletedRows === 0) {
        return res
          .status(404)
          .json({ message: "Data tidak ditemukan atau sudah dihapus" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Gagal menghapus data lama: " + error.message });
    }

    // 🟢 **Simpan data baru dengan paralelisasi untuk efisiensi**
    try {
      const newDataArray = await Promise.all(
        isu.map(async (item) => {
          return await IsuSpesifik.create({
            isu: item,
            thang: data.year,
            periode: monthNumber,
            kdkanwil: data.kodeKanwil,
            kdlokasi: data.lokasiKanwil,
            kdddept: data.kddept,
            username: data.username,
            keyId: key,
          });
        })
      );

      return res.status(201).json({
        message: "Data berhasil diperbarui",
        data: newDataArray,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Gagal menyimpan data baru: " + error.message });
    }
  } catch (error) {
    console.error("Error saat mengedit data:", error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan: " + error.message });
  }
};

// ✅ Delete Data by ID
export const deleteIsuSpesifik = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await IsuSpesifik.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    await data.destroy();
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import { Sequelize } from "sequelize";
import db from "../../config/Database8.js";
import { decryptData } from "../../middleware/Decrypt.js";
import DataBapanas from "../../models/mbg/DataBapanas.js";
import DataBPS from "../../models/mbg/DataBPS.js";
import DataTriwulanan from "../../models/mbg/DataTriwulanan.js";
import Permasalahan from "../../models/mbg/permasalahan.js";
import KesimpulanSaran from "../../models/mbg/kesimpulan_saran.js";

export const SimpanData = async (req, res) => {
  console.log("Received request body:", req.body);
  
  // Handle nested data structure
  const dataSource = req.body.data?.data || req.body.data || req.body;
  
  const {
    kode_kanwil,
    indikator,
    customIndikator,
    customSatuan,
    triwulan,
    keterangan,
    tahun,
    username,
    satuan,
    id,
    kesimpulan,
    saran,
  } = dataSource;

  console.log("Extracted data:", {
    kode_kanwil, indikator, customIndikator, customSatuan, 
    triwulan, keterangan, tahun, username, satuan, id, kesimpulan, saran
  });
  // Validasi dinamis sesuai id
  if (id === "1" || id === "2" || id === "3" || id === "4") {
    if (!kode_kanwil || !indikator || !triwulan || !tahun || !username) {
      return res.status(400).json({ message: "Data wajib belum lengkap." });
    }  } else if (id === "5") {
    if (!kode_kanwil || !triwulan || !tahun || !username || !kesimpulan || !saran) {
      return res.status(400).json({ message: "Data wajib belum lengkap." });
    }
  } else {
    return res.status(400).json({ message: "Tipe data tidak valid. ID harus berupa '1', '2', '3', '4' atau '5'." });
  }
  if (id === "1") {
    try {
      const newData = await DataBPS.create({
        kode_kanwil: kode_kanwil, // Map kode_kanwil dari frontend ke kode_kanwil di model
        indikator,
        customIndikator,
        customSatuan: customSatuan || satuan,
        triwulan,
        keterangan,
        tahun,
        username,
      });

      return res.status(201).json({
        message: "Data berhasil disimpan.",
        data: newData,
      });    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan saat menyimpan data." });
    }  } else if (id === "2") {
    console.log("ID = 2 (DataBapanas), kode_kanwil value:", kode_kanwil);
    console.log("Type of kode_kanwil:", typeof kode_kanwil);
    
    if (!kode_kanwil) {
      console.error("kode_kanwil is null/undefined for DataBapanas");
      return res.status(400).json({ message: "kode_kanwil tidak boleh kosong untuk DataBapanas." });
    }
    
    try {
      const newData = await DataBapanas.create({
        kode_kanwil: kode_kanwil, // Map kode_kanwil dari frontend ke kode_kanwil di model dan database
        indikator,
        customSatuan: customSatuan || satuan,
        triwulan,
        keterangan,
        tahun,
        username,
      });

      return res.status(201).json({
        message: "Data berhasil disimpan.",
        data: newData,
      });    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan saat menyimpan data." });
    }  } else if (id === "3") {
    // Handle id="3" for DataTriwulanan
    console.log("ID = 3 (DataTriwulanan), kode_kanwil value:", kode_kanwil);
    console.log("indikator value:", indikator);
    console.log("keterangan value:", keterangan);
    
    if (!kode_kanwil) {
      console.error("kode_kanwil is null/undefined for DataTriwulanan");
      return res.status(400).json({ message: "kode_kanwil tidak boleh kosong untuk DataTriwulanan." });
    }
    
    try {
      const newData = await DataTriwulanan.create({
        kode_kanwil: kode_kanwil,
        kategori: indikator,  // Map indikator to kategori for DataTriwulanan model
        keterangan: keterangan,
        triwulan,
        tahun,
        username,
      });

      return res.status(201).json({
        message: "Data berhasil disimpan.",
        data: newData,
      });    } catch (error) {
      console.error("Gagal menyimpan data DataTriwulanan:", error);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan saat menyimpan data." });
    }
  } else if (id === "4") {
    // Handle id="4" for Permasalahan
    console.log("ID = 4 (Permasalahan), kode_kanwil value:", kode_kanwil);
    console.log("kategori value:", indikator);
    console.log("keterangan value:", keterangan);
    
    if (!kode_kanwil) {
      console.error("kode_kanwil is null/undefined for Permasalahan");
      return res.status(400).json({ message: "kode_kanwil tidak boleh kosong untuk Permasalahan." });
    }
    
    try {
      const newData = await Permasalahan.create({
        kode_kanwil: kode_kanwil,
        kategori: indikator,  // Map indikator to kategori for Permasalahan model
        keterangan: keterangan,
        triwulan,
        tahun,
        username,
      });

      return res.status(201).json({
        message: "Data berhasil disimpan.",
        data: newData,
      });    } catch (error) {
      console.error("Gagal menyimpan data Permasalahan:", error);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan saat menyimpan data." });
    }  } else if (id === "5") {
    // Handle id="5" for KesimpulanSaran
    console.log("ID = 5 (KesimpulanSaran), kode_kanwil value:", kode_kanwil);
    console.log("kesimpulan value:", kesimpulan);
    console.log("saran value:", saran);
    
    if (!kode_kanwil) {
      console.error("kode_kanwil is null/undefined for KesimpulanSaran");
      return res.status(400).json({ message: "kode_kanwil tidak boleh kosong untuk KesimpulanSaran." });
    }
    
    try {
      const newData = await KesimpulanSaran.create({
        kode_kanwil: kode_kanwil,
        triwulan,
        tahun,
        kesimpulan: kesimpulan,
        saran: saran,
        username,
      });

      return res.status(201).json({
        message: "Data berhasil disimpan.",
        data: newData,
      });    } catch (error) {
      console.error("Gagal menyimpan data KesimpulanSaran:", error);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan saat menyimpan data." });
    }
  } else {
    return res.status(400).json({
      message: "Tipe data tidak valid. ID harus berupa '1', '2', '3', '4' atau '5'."
    });
  }
};
export const TayangDataKanwil = async (req, res) => {
  const queryParams = req.query.queryParams;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const decryptedData = decryptData(queryParams).replace(/"/g, "");

  try {
    const resultsQuery = `${decryptedData}  LIMIT ${limit} OFFSET ${offset}`;
    const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${decryptedData}) AS totalCountSubquery`;
    // console.log(resultsQuery);
    const [results, totalCountResult] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
        },
      }),
      db.query(totalCountQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalCount = totalCountResult[0].totalCount;

    res.json({
      result: results,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalRows: totalCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.original.sqlMessage,
    });
  }
};

export const hapusDataKanwil = async (req, res) => {  try {
    const { id, kode_kanwil, triwulan, type } = req.params;    if (type === "1") {
      const data = await DataBPS.findOne({
        where: { id: id, kode_kanwil: kode_kanwil, triwulan: triwulan },
      });

      if (!data) {
        return res
          .status(404)
          .json({ message: "Data tidak ditemukan atau kode_kanwil tidak cocok" });
      }

      await DataBPS.destroy({
        where: { id: id, kode_kanwil: kode_kanwil, triwulan: triwulan },      });

      res.status(200).json({ message: "Data Rekam BPS berhasil dihapus" });
    }
    if (type === "2") {
      const data = await DataBapanas.findOne({
        where: { id: id, kode_kanwil: kode_kanwil, triwulan: triwulan },
      });

      if (!data) {
        return res
          .status(404)
          .json({ message: "Data tidak ditemukan atau kode_kanwil tidak cocok" });
      }

      await DataBapanas.destroy({
        where: { id: id, kode_kanwil: kode_kanwil, triwulan: triwulan },
      });

      res.status(200).json({ message: "Data komoditas berhasil dihapus" });
    }    if (type === "3") {
      const data = await DataTriwulanan.findOne({
        where: { id: id, kode_kanwil: kode_kanwil, triwulan: triwulan },
      });

      if (!data) {
        return res
          .status(404)
          .json({ message: "Data tidak ditemukan atau kode_kanwil tidak cocok" });
      }

      await DataTriwulanan.destroy({
        where: { id: id, kode_kanwil: kode_kanwil, triwulan: triwulan },
      });

      res.status(200).json({ message: "Data triwulanan berhasil dihapus" });
    }
    if (type === "4") {
      const data = await Permasalahan.findOne({
        where: { id: id, kode_kanwil: kode_kanwil, triwulan: triwulan },
      });

      if (!data) {
        return res
          .status(404)
          .json({ message: "Data tidak ditemukan atau kode_kanwil tidak cocok" });
      }

      await Permasalahan.destroy({
        where: { id: id, kode_kanwil: kode_kanwil, triwulan: triwulan },
      });

      res.status(200).json({ message: "Data permasalahan berhasil dihapus" });
    }
    if (type === "5") {
      const data = await KesimpulanSaran.findOne({
        where: { id: id, kode_kanwil: kode_kanwil, triwulan: triwulan },
      });

      if (!data) {
        return res
          .status(404)
          .json({ message: "Data tidak ditemukan atau kode_kanwil tidak cocok" });
      }

      await KesimpulanSaran.destroy({
        where: { id: id, kode_kanwil: kode_kanwil, triwulan: triwulan },
      });

      res.status(200).json({ message: "Data kesimpulan dan saran berhasil dihapus" });
    }
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({ message: "Gagal menghapus data", error: error.message });
  }
};

export const updateDataKanwil = async (req, res) => {
  // Handle nested data structure
  const dataSource = req.body.data?.data || req.body.data || req.body;
  const {
    id,
    kode_kanwil,
    indikator,
    customIndikator,
    customSatuan,
    triwulan,
    keterangan,
    tahun,
    username,
    kesimpulan,
    saran,
  } = dataSource;

  // ID dari req.body (tipe data)
  const idType = req.body.id;
  // ID record yang akan diupdate dari dataSource
  const recordId = dataSource.id;

  console.log('Update request - ID Type:', idType, 'Record ID:', recordId);
  console.log('Data source:', dataSource);

  // Validasi dinamis sesuai id
  if (idType === "1" || idType === "2" || idType === "3" || idType === "4") {
    if (!kode_kanwil || !indikator || !triwulan || !tahun || !username) {
      return res.status(400).json({ message: "Data wajib belum lengkap." });
    }
  } else if (idType === "5") {
    if (!kode_kanwil || !triwulan || !tahun || !username || !kesimpulan || !saran) {
      return res.status(400).json({ message: "Data wajib belum lengkap." });
    }
  } else {
    return res.status(400).json({ message: "Tipe data tidak valid. ID harus berupa '1', '2', '3', '4' atau '5'." });
  }

  try {
    let updatedData;
    if (idType === "1") {
      // DataBPS
      updatedData = await DataBPS.update(
        {
          indikator,
          customIndikator,
          customSatuan: customSatuan,
          triwulan,
          keterangan,
          tahun,
          username,
        },
        {
          where: { id: recordId }, // HANYA pakai id agar update pasti kena
        }
      );
    } else if (idType === "2") {
      // DataBapanas
      updatedData = await DataBapanas.update(
        {
          indikator,
          customSatuan: customSatuan,
          triwulan,
          keterangan,
          tahun,
          username,
        },
        {
          where: { id: recordId },
        }
      );
    } else if (idType === "3") {
      // DataTriwulanan
      updatedData = await DataTriwulanan.update(
        {
          kategori: indikator,
          keterangan,
          triwulan,
          tahun,
          username,
        },
        {
          where: { id: recordId },
        }
      );
    } else if (idType === "4") {
      // Permasalahan
      updatedData = await Permasalahan.update(
        {
          kategori: indikator,
          keterangan,
          triwulan,
          tahun,
          username,
        },
        {
          where: { id: recordId },
        }
      );
    } else if (idType === "5") {
      // KesimpulanSaran
      updatedData = await KesimpulanSaran.update(
        {
          triwulan,
          tahun,
          kesimpulan,
          saran,
          username,
        },
        {
          where: { id: recordId },
        }
      );
    }
    
    console.log('Update result:', updatedData);
    
    if (updatedData && updatedData[0] > 0) {
      return res.status(200).json({ message: "Data berhasil diupdate." });
    } else {
      return res.status(404).json({ message: "Data tidak ditemukan atau tidak ada perubahan." });
    }
  } catch (error) {
    console.error("Gagal mengupdate data:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat mengupdate data.", error: error.message });
  }
};

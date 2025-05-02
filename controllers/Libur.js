import Libur from "../models/LiburModel.js";
import Sequelize from "sequelize";

export const getLibur = async (req, res) => {
  try {
    const datalibur = await Libur.findAll({
      attributes: ["tgl_libur", "keterangan", "id"],
    });
    res.json(datalibur);
  } catch (error) {
    console.log(error);
  }
};

export const insertLibur = async (req, res) => {
  const { tanggal, keterangan } = req.body;
  try {
    await Libur.create({
      TGL_LIBUR: tanggal,
      KETERANGAN: keterangan,
    });
    res.json({ msg: "Data Insert Libur Berhasil" });
  } catch (error) {
    console.log(error);
  }
};
export const hapusLibur = async (req, res) => {
  const userId = req.params.id;
  try {
    await Libur.destroy({ where: { id: userId } });
    res.status(200).json({ message: "Libur berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus Libur" });
  }
};
// export const detailDau = async (req, res) => {
//   try {
//     const totalCount = await Dau.count();
//     const allData = await Dau.findOne();
//     res.json({ totalCount, updated: allData.UPDATED });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

import Sequelize, { Op, literal, where } from "sequelize";
import db from "../../config/Database6.js";
import Proyeksi_Model from "../../models/proyeksi/Proyeksi_Model.js";

export const simpanProyeksi = async (req, res) => {
  try {
    const {
      kppn,
      tahun,
      jenis,
      keperluan,
      periode,
      januari,
      februari,
      maret,
      april,
      mei,
      juni,
      juli,
      agustus,
      september,
      oktober,
      november,
      desember,
      uraian,
    } = req.body;
    const data = kppn;
    const parts = data.split("-");

    const kodekppn = parts[0];
    const kodesatker = parts[1];
    // Menyimpan data proyeksi ke dalam database
    const proyeksi = await Proyeksi_Model.create({
      kdkppn: kodekppn,
      thang: tahun,
      kdsatker: kodesatker,
      jenis_tkd: jenis,
      keperluan: keperluan,
      periode: periode,
      jan: januari,
      feb: februari,
      mar: maret,
      apr: april,
      mei,
      jun: juni,
      jul: juli,
      ags: agustus,
      sep: september,
      okt: oktober,
      nov: november,
      des: desember,
      keterangan: uraian,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({ success: true, data: proyeksi });
  } catch (error) {
    console.error("Error saving proyeksi:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const hapusProyeksi = async (req, res) => {
  let id = req.params.id;

  try {
    await Proyeksi_Model.destroy({
      where: {
        id: id,
      },
    });

    res.status(200).json({ msg: "Data Proyeksi Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};
export const editProyeksi = async (req, res) => {
  try {
    const {
      kppn,
      tahun,
      jenis,
      keperluan,
      periode,
      januari,
      februari,
      maret,
      april,
      mei,
      juni,
      juli,
      agustus,
      september,
      oktober,
      november,
      desember,
      uraian,
      id,
    } = req.body;
    const data = kppn;
    const parts = data.split("-");

    const kodekppn = parts[0];
    const kodesatker = parts[1];
    // Menyimpan data proyeksi ke dalam database
    const proyeksi = await Proyeksi_Model.update(
      {
        kdkppn: kodekppn,
        thang: tahun,
        kdsatker: kodesatker,
        jenis_tkd: jenis,
        keperluan: keperluan,
        periode: periode,
        jan: januari,
        feb: februari,
        mar: maret,
        apr: april,
        mei: mei,
        jun: juni,
        jul: juli,
        ags: agustus,
        sep: september,
        okt: oktober,
        nov: november,
        des: desember,
        keterangan: uraian,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        where: {
          id: id,
        },
      }
    );

    return res.status(201).json({ success: true, data: proyeksi });
  } catch (error) {
    console.error("Error saving proyeksi:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

import { decryptData } from "../../middleware/Decrypt.js";
import Sequelize, { Op } from "sequelize";
import Isu_Model from "../../models/kinerja/isumodel.js";
import TemuanBpk_Model from "../../models/kinerja/temuanbpk.js";
import TrenBulanan_Model from "../../models/kinerja/trenbulanan.js";
import TrenDukman_Model from "../../models/kinerja/trendukman.js";
import TrenJenbel_Model from "../../models/kinerja/trenjenbel.js";
import db from "../../config/Database3.js";
import db135 from "../../config/Database135.js";
import TemuanBpkDetail_Model from "../../models/kinerja/temuanbpkdetail.js";
import { v4 as uuidv4 } from "uuid";
import Output_Model from "../../models/kinerja/output.js";
import OutputDetail_Model from "../../models/kinerja/outputdetail.js";
import TrenSdana_Model from "../../models/kinerja/trensdana.js";
import Ikpa_Model from "../../models/kinerja/ikpa.js";
import TrenUptup_Model from "../../models/kinerja/trenduptup.js";

export const simpanIsu = async (req, res) => {
  const { input1, input2, input3, input4 } = req.body;
  const { data } = req.body;

  if (!data) {
    res.status(400).json({ msg: "Error Mengambil Referensi Data" });
    return;
  }
  const { thang, periode, dept, prov, user } = data;
  await Isu_Model.destroy({
    where: {
      thang,
      kddept: dept,
      periode,
      // username: user,
    },
  });

  const isuData = [
    { isu: input1, username: user, thang, kddept: dept, periode, prov },
    { isu: input2, username: user, thang, kddept: dept, periode, prov },
    { isu: input3, username: user, thang, kddept: dept, periode, prov },
    { isu: input4, username: user, thang, kddept: dept, periode, prov },
  ];

  const createdIsu = await Promise.all(
    isuData.map(async (data) => {
      const newIsu = await Isu_Model.create(data);
      return newIsu;
    })
  );

  await Isu_Model.destroy({
    where: {
      [Op.or]: [
        { isu: null },
        { isu: "" }, // Empty string condition
      ],
    },
  });

  res.json({ msg: "Data Insert Berhasil" });
};

export const simpanTren = async (req, res) => {
  const { input1, input2, input3, input4, input5 } = req.body;
  const { data } = req.body;

  if (!data) {
    res.status(400).json({ msg: "Error Mengambil Referensi Data" });
    return;
  }
  const { thang, periode, dept, prov, user } = data;

  try {
    await TrenDukman_Model.destroy({
      where: {
        thang,
        kddept: dept,
        periode,
        // username: user,
      },
    });
    const dataInput1 = {
      isu: input1,
      username: user,
      thang,
      kddept: dept,
      periode,
      prov,
    };
    const TabelA_Entry = await TrenDukman_Model.create(dataInput1);

    await TrenJenbel_Model.destroy({
      where: {
        thang,
        kddept: dept,
        periode,
        // username: user,
      },
    });
    const dataInput2 = {
      isu: input2,
      username: user,
      thang,
      kddept: dept,
      periode,
      prov,
    };
    const TabelB_Entry = await TrenJenbel_Model.create(dataInput2);

    await TrenBulanan_Model.destroy({
      where: {
        thang,
        kddept: dept,
        periode,
        // username: user,
      },
    });
    const dataInput3 = {
      isu: input3,
      username: user,
      thang,
      kddept: dept,
      periode,
      prov,
    };
    const TabelC_Entry = await TrenBulanan_Model.create(dataInput3);

    await TrenSdana_Model.destroy({
      where: {
        thang,
        kddept: dept,
        periode,
        // username: user,
      },
    });
    const dataInput4 = {
      isu: input4,
      username: user,
      thang,
      kddept: dept,
      periode,
      prov,
    };
    const TabelD_Entry = await TrenSdana_Model.create(dataInput4);

    await TrenUptup_Model.destroy({
      where: {
        thang,
        kddept: dept,
        periode,
        // username: user,
      },
    });

    const dataInput5 = {
      isu: input5,
      username: user,
      thang,
      kddept: dept,
      periode,
      prov,
    };
    const TabelE_Entry = await TrenUptup_Model.create(dataInput5);

    res.json({ msg: "Data Insert Berhasil" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal menyimpan data" });
  }
};

export const simpanTemuan = async (req, res) => {
  const {
    temuan,
    nilai,
    input3,
    input4,
    input5,
    input6,
    idedit,
    idedit1,
    idedit2,
    idedit3,
    idedit4,
  } = req.body;
  const { data } = req.body;

  if (!data) {
    res.status(400).json({ msg: "Error Mengambil Referensi Data" });
    return;
  }
  const { thang, periode, dept, prov, user } = data;
  const randomKey = uuidv4();
  if (!data) {
    res.status(400).json({ msg: "Error Mengambil data" });
    return;
  }
  try {
    const isuData = [
      { isu: temuan, nilai: nilai, username: req.session.username },
    ];

    const dataInput2 = {
      id_temuan: randomKey ? randomKey : "",
      isu: temuan ? temuan : "",
      username: user,
      nilai: nilai,
      thang: thang ? thang : "",
      kddept: dept ? dept : "",
      periode: periode ? periode : "",
    };
    if (idedit) {
      const TabelB_Entry = await TemuanBpk_Model.update(dataInput2, {
        where: { id_temuan: idedit },
      });
    } else {
      const TabelB_Entry = await TemuanBpk_Model.create(dataInput2);
    }

    const cekId = await TemuanBpk_Model.findOne({
      attributes: ["id_temuan"],
      where: {
        id_temuan: randomKey,
      },
    });

    if (!cekId) {
      return res.status(404).json({ message: "ID Temuan not found" });
    }

    await TemuanBpkDetail_Model.destroy({
      where: {
        id_temuan: randomKey,
      },
    });

    const dataInput3 = {
      id_temuan: randomKey ? randomKey : "",
      isu: input3 ? input3 : "",

      username: user,
      thang: thang ? thang : "",
      kddept: dept ? dept : "",
      periode: periode ? periode : "",
    };
    if (idedit) {
      const TabelC_Entry = await TemuanBpkDetail_Model.update(dataInput3, {
        where: { id: idedit1 },
      });
    } else {
      const TabelC_Entry = await TemuanBpkDetail_Model.create(dataInput3);
    }

    const dataInput4 = {
      id_temuan: randomKey ? randomKey : "",
      isu: input4 ? input4 : "",

      username: user,
      thang: thang ? thang : "",
      kddept: dept ? dept : "",
      periode: periode ? periode : "",
    };

    if (idedit) {
      const TabelD_Entry = await TemuanBpkDetail_Model.update(dataInput4, {
        where: { id: idedit2 },
      });
    } else {
      const TabelD_Entry = await TemuanBpkDetail_Model.create(dataInput4);
    }

    const dataInput5 = {
      id_temuan: randomKey ? randomKey : "",
      isu: input5 ? input5 : "",
      username: user,
      thang: thang ? thang : "",
      kddept: dept ? dept : "",
      periode: periode ? periode : "",
    };

    if (idedit) {
      const TabelE_Entry = await TemuanBpkDetail_Model.update(dataInput5, {
        where: { id: idedit3 },
      });
    } else {
      const TabelE_Entry = await TemuanBpkDetail_Model.create(dataInput5);
    }

    const dataInput6 = {
      id_temuan: randomKey ? randomKey : "",
      isu: input6 ? input6 : "",
      username: user,
      thang: thang ? thang : "",
      kddept: dept ? dept : "",
      periode: periode ? periode : "",
    };

    if (idedit) {
      const TabelF_Entry = await TemuanBpkDetail_Model.update(dataInput6, {
        where: { id: idedit4 },
      });
    } else {
      const TabelF_Entry = await TemuanBpkDetail_Model.create(dataInput6);
    }

    await TemuanBpk_Model.destroy({
      where: {
        [Op.or]: [
          { isu: null },
          { isu: "" }, // Empty string condition
          { nilai: null },
          { nilai: "" }, // Empty string condition
        ],
      },
    });

    await TemuanBpkDetail_Model.destroy({
      where: {
        [Op.or]: [
          { isu: null },
          { isu: "" }, // Empty string condition
        ],
      },
    });

    res.json({ msg: "Data Insert Berhasil" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal menyimpan data" });
  }
};

export const getDataKinerja = async (req, res) => {
  const queryParams = req.query.queryParams;

  const decryptedData = decryptData(queryParams).replace(/"/g, "");

  try {
    const resultsQuery = `${decryptedData} `;

    const [results] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    res.json({
      result: results,
    });
  } catch (error) {
    console.error("Error in processing query:", error);
    const errorMessage = error.original
      ? error.original.sqlMessage
      : "Terjadi kesalahan dalam memproses permintaan.";
    res.status(500).json({ error: errorMessage });
  }
};

export const chartKinerja = async (req, res) => {
  const queryParams = req.query.queryParams;

  const decryptedData = decryptData(queryParams).replace(/"/g, "");

  try {
    const resultsQuery = `${decryptedData} `;

    const [results] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    res.json({
      result: results,
    });
  } catch (error) {
    console.error("Error in processing query:", error);
    const errorMessage = error.original
      ? error.original.sqlMessage
      : "Terjadi kesalahan dalam memproses permintaan.";
    res.status(500).json({ error: errorMessage });
  }
};

export const dataTkd = async (req, res) => {
  const queryParams = req.query.queryParams;

  const decryptedData = decryptData(queryParams).replace(/"/g, "");

  try {
    const resultsQuery = `${decryptedData} `;

    const [results] = await Promise.all([
      db135.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    res.json({
      result: results,
    });
  } catch (error) {
    console.error("Error in processing query:", error);
    const errorMessage = error.original
      ? error.original.sqlMessage
      : "Terjadi kesalahan dalam memproses permintaan.";
    res.status(500).json({ error: errorMessage });
  }
};

export const hapustemuan = async (req, res) => {
  try {
    const query = await TemuanBpk_Model.findOne({
      where: {
        id_temuan: req.params.id_temuan,
      },
    });
    if (!query) return res.status(404).json({ msg: "Data Not Found" });
  } catch (error) {
    console.log(error.message);
  }
  try {
    await TemuanBpk_Model.destroy({
      where: {
        id_temuan: req.params.id_temuan,
      },
    });
    await TemuanBpkDetail_Model.destroy({
      where: {
        id_temuan: req.params.id_temuan,
      },
    });
    res.status(200).json({ msg: "Data Temuan Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const simpanOutput = async (req, res) => {
  const {
    namaoutput,
    catatan,
    tahun1,
    pagu1,
    realisasi1,
    persen1,
    tahun2,
    pagu2,
    realisasi2,
    persen2,
    tahun3,
    pagu3,
    realisasi3,
    persen3,
    id_output,
    idedit1,
    idedit2,
    idedit3,
  } = req.body;

  const { data } = req.body;
  if (!data) {
    res.status(400).json({ msg: "Error Mengambil Referensi Data" });
    return;
  }
  const { thang, periode, dept, prov, user } = data;
  if (!data) {
    res.status(400).json({ msg: "Error Mengambil data" });
    return;
  }
  const randomKey = uuidv4();

  try {
    const isuData = [
      {
        namaoutput: namaoutput,
        catatan: catatan,
        username: req.session.username,
      },
    ];

    const dataInput2 = {
      id_output: randomKey ? randomKey : "",
      namaoutput: namaoutput ? namaoutput : "",
      catatan: catatan ? catatan : "",
      username: user,
      thang: thang ? thang : "",
      kddept: dept ? dept : "",
      periode: periode ? periode : "",
      prov: prov ? prov : "",
    };

    if (id_output) {
      const TabelB_Entry = await Output_Model.update(dataInput2, {
        where: { id_output: id_output },
      });
    } else {
      const TabelB_Entry = await Output_Model.create(dataInput2);
    }
    const cekId = await Output_Model.findOne({
      attributes: ["id_output"],
      where: {
        id_output: randomKey,
      },
    });

    if (!cekId) {
      return res.status(404).json({ message: "ID Temuan not found" });
    }

    await OutputDetail_Model.destroy({
      where: {
        id_output: randomKey,
      },
    });

    const dataInput3 = {
      id_output: randomKey ? randomKey : "",
      tahun: tahun1 ? tahun1 : "",
      pagu: pagu1 ? pagu1 : "",
      realisasi: realisasi1 ? realisasi1 : "",
      persen: persen1 ? persen1 : "",
      username: user,
      thang: thang ? thang : "",
      kddept: dept ? dept : "",
      periode: periode ? periode : "",
      prov: prov ? prov : "",
    };

    if (id_output) {
      const TabelC_Entry = await OutputDetail_Model.update(dataInput3, {
        where: { id: idedit1 },
      });
    } else {
      const TabelC_Entry = await OutputDetail_Model.create(dataInput3);
    }

    const dataInput4 = {
      id_output: randomKey ? randomKey : "",
      tahun: tahun2 ? tahun2 : "",
      pagu: pagu2 ? pagu2 : "",
      realisasi: realisasi2 ? realisasi2 : "",
      persen: persen2 ? persen2 : "",
      username: user,
      thang: thang ? thang : "",
      kddept: dept ? dept : "",
      periode: periode ? periode : "",
      prov: prov ? prov : "",
    };
    if (id_output) {
      const TabelD_Entry = await OutputDetail_Model.update(dataInput4, {
        where: { id: idedit2 },
      });
    } else {
      const TabelD_Entry = await OutputDetail_Model.create(dataInput4);
    }

    const dataInput5 = {
      id_output: randomKey ? randomKey : "",
      tahun: tahun3 ? tahun3 : "",
      pagu: pagu3 ? pagu3 : "",
      realisasi: realisasi3 ? realisasi3 : "",
      persen: persen3 ? persen3 : "",
      username: user,
      thang: thang ? thang : "",
      kddept: dept ? dept : "",
      periode: periode ? periode : "",
      prov: prov ? prov : "",
    };
    if (id_output) {
      const TabelE_Entry = await OutputDetail_Model.update(dataInput5, {
        where: { id: idedit3 },
      });
    } else {
      const TabelE_Entry = await OutputDetail_Model.create(dataInput5);
    }
    await Output_Model.destroy({
      where: {
        [Op.or]: [
          { namaoutput: null },
          { namaoutput: "" }, // Empty string condition
          { catatan: null },
          { catatan: "" }, // Empty string condition
        ],
      },
    });

    // await OutputDetail_Model.destroy({
    //   where: {
    //     [Op.or]: [
    //       { tahun: null },
    //       { tahun: "" }, // Empty string condition
    //       { pagu: null },
    //       { pagu: "" }, // Empty string condition
    //       { realisasi: null },
    //       { realisasi: "" }, // Empty string condition
    //       { persen: null },
    //       { persen: "" }, // Empty string condition
    //     ],
    //   },
    // });

    res.json({ msg: "Data Insert Berhasil" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal menyimpan data" });
  }
};

export const hapusoutput = async (req, res) => {
  try {
    const query = await Output_Model.findOne({
      where: {
        id_output: req.params.id_output,
      },
    });
    if (!query) return res.status(404).json({ msg: "Data Not Found" });
  } catch (error) {
    console.log(error.message);
  }
  try {
    await Output_Model.destroy({
      where: {
        id_output: req.params.id_output,
      },
    });
    await OutputDetail_Model.destroy({
      where: {
        id_output: req.params.id_output,
      },
    });
    res.status(200).json({ msg: "Data Temuan Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const simpanIkpa = async (req, res) => {
  try {
    const { input1, input2, input3 } = req.body;
    const { data } = req.body;

    if (!data) {
      res.status(400).json({ msg: "Error Mengambil Referensi Data" });
      return;
    }
    const { thang, periode, dept, prov, user } = data;
    try {
      if (!input3) {
        await Ikpa_Model.destroy({
          where: {
            kddept: dept,
            periode,
            thang,
            username: user,
          },
        });
      }
      const isuData = {
        nilaiikpa: input2,
        username: user,
        thang: input1,
        kddept: dept,
        periode,
        prov,
      };

      if (input3) {
        const TabelE_Entry = await Ikpa_Model.update(isuData, {
          where: { id: input3 },
        });
      } else {
        const newIsu = await Ikpa_Model.create(isuData);
      }

      await Ikpa_Model.destroy({
        where: {
          [Op.or]: [
            { thang: null },
            { thang: "" }, // Empty string condition
            { nilaiikpa: null },
            { nilaiikpa: "" }, // Empty string condition
          ],
        },
      });
      res.json({ msg: "Data Insert Berhasil" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Gagal menyimpan data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal menyimpan data" });
  }
};

export const hapusikpa = async (req, res) => {
  try {
    const query = await Ikpa_Model.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!query) return res.status(404).json({ msg: "Data Not Found" });
  } catch (error) {
    console.log(error.message);
  }
  try {
    await Ikpa_Model.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "Data Temuan Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

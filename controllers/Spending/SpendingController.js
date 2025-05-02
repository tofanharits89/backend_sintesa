import Sequelize, { Op, literal } from "sequelize";
import { decryptData } from "../../middleware/Decrypt.js";
import db from "../../config/Database3.js";
import Spending_Model from "../../models/spending/Spending_Model.js";
import Pok_Model from "../../models/spending/Pok_Model.js";
import Log_menu from "../../models/Log_menu.js";
import Status_Model from "../../models/spending/Status_Model.js";

export const dataSpending = async (req, res) => {
  const queryParams = req.query.queryParams;

  const decryptedData = decryptData(queryParams).replace(/"/g, "");

  try {
    const resultsQuery = `${decryptedData} `;

    const [results] = await Promise.all([
      db.query(resultsQuery, {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    await Log_menu.create({
      ip: clientIP,
      username: req.query.user,
      nm_menu: "SPENDING_REVIEW",
    });
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

export const simpanInefisiensi = async (req, res) => {
  const {
    volume,
    hargaSatuan,
    nilai,
    keterangan,
    kdindex,
    jenis,
    user,
    thang,
    satkeg,
    pagu,
    uraian,
    kdkanwil,
    sebab,
  } = req.body;
  // console.log(req.body);
  if (
    !volume ||
    !hargaSatuan ||
    !nilai ||
    !kdindex ||
    !user ||
    !jenis ||
    !sebab
  ) {
    return res.status(400).json({ error: "Semua field harus diisi" + sebab });
  }
  const modifiedKdindex = kdindex.replace(" ", "");
  const tigaenam = modifiedKdindex.length;
  let kddept = kdindex.substr(0, 3);
  let kdunit = kdindex.substr(3, 2);
  let kdsatker = kdindex.substr(5, 6);
  let kddekon = kdindex.substr(11, 1);
  try {
    const result = await Spending_Model.findOne({
      where: {
        posisi: kdindex,
        kdreview: jenis,
        kddept: kddept,
        kdunit: kdunit,
        kdsatker: kdsatker,
        kddekon: kddekon,
      },
    });

    if (result) {
      try {
        await Spending_Model.update(
          {
            volkeg: parseInt(volume),
            satkeg: satkeg,
            hargasat: parseInt(hargaSatuan),
            jumlah: parseInt(nilai),
            inefisiensi: parseInt(pagu - nilai),
            keterangan: keterangan,
            sebab: sebab,
            posisi: kdindex,
            username: user,
          },
          {
            where: {
              posisi: kdindex,
              kdreview: jenis,
              kddept: kddept,
              kdunit: kdunit,
              kdsatker: kdsatker,
              kddekon: kddekon,
            },
          }
        );

        try {
          const resultsQuery = `UPDATE spending_review.dt_pok_2024 SET STATUS='true' WHERE kddept='${kddept}' AND kdunit='${kdunit}' AND kdsatker='${kdsatker}' AND kddekon='${kddekon}' AND LEFT(kdindex, 36) = '${kdindex}' `;

          await db.query(resultsQuery, {
            type: Sequelize.QueryTypes.UPDATE,
          });
        } catch (error) {
          console.error("Error update:", error);
        }
        try {
          const ubahNilaiNol = `UPDATE spending_review.dt_review_2024 SET inefisiensi=0 WHERE inefisiensi<0 `;

          await db.query(ubahNilaiNol, {
            type: Sequelize.QueryTypes.UPDATE,
          });
        } catch (error) {
          console.error("Error update:", error);
        }
        res.status(200).json({ msg: "Data Successfuly Saved" });
      } catch (error) {
        console.error("Error saving:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      try {
        await Spending_Model.create({
          thang: thang,
          kddept: modifiedKdindex.substr(0, 3),
          kdunit: modifiedKdindex.substr(3, 2),
          kdsatker: modifiedKdindex.substr(5, 6),
          kddekon: modifiedKdindex.substr(11, 1),
          kdprogram: modifiedKdindex.substr(12, 2),
          kdgiat: modifiedKdindex.substr(14, 4),
          kdoutput: modifiedKdindex.substr(18, 3),
          kdsoutput: modifiedKdindex.substr(21, 3),
          kdkmpnen: modifiedKdindex.substr(24, 3),
          kdskmpnen:
            tigaenam !== 36
              ? modifiedKdindex.substr(27, 1)
              : modifiedKdindex.substr(27, 2),
          kdakun:
            tigaenam !== 36
              ? modifiedKdindex.substr(28, 6)
              : modifiedKdindex.substr(29, 6),
          noitem:
            tigaenam !== 36
              ? modifiedKdindex.substr(33, 1)
              : modifiedKdindex.substr(35, 1),
          nmitem: uraian,
          volkeg: parseInt(volume),
          satkeg: satkeg,
          hargasat: parseInt(hargaSatuan),
          jumlah: parseInt(nilai),
          inefisiensi: parseInt(pagu - nilai),
          kdreview: jenis,
          keterangan: keterangan,
          posisi: kdindex,
          sebab: sebab,
          // flag: flag,
          kdkanwil: kdkanwil === "00" ? "KP" : kdkanwil,
          username: user,
        });

        try {
          const resultsQuery = `UPDATE spending_review.dt_pok_2024 SET STATUS='true' WHERE kddept='${kddept}' AND kdunit='${kdunit}' AND kdsatker='${kdsatker}' AND kddekon='${kddekon}' AND LEFT(kdindex, 36) = '${kdindex}' `;

          await db.query(resultsQuery, {
            type: Sequelize.QueryTypes.UPDATE,
          });
        } catch (error) {
          console.error("Error update:", error);
        }
        try {
          const ubahNilaiNol = `UPDATE spending_review.dt_review_2024 SET inefisiensi=0 WHERE inefisiensi<0 `;

          await db.query(ubahNilaiNol, {
            type: Sequelize.QueryTypes.UPDATE,
          });
        } catch (error) {
          console.error("Error update:", error);
        }
        res.status(200).json({ msg: "Data Successfuly Saved" });
      } catch (error) {
        console.error("Error saving:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  } catch (error) {
    console.error("Error cek data:", error);
  }
};

export const hapusInefisiensi = async (req, res) => {
  let kddept = req.params.id.substr(0, 3);
  let kdunit = req.params.id.substr(3, 2);
  let kdsatker = req.params.id.substr(5, 6);
  let kddekon = req.params.id.substr(11, 1);

  try {
    const query = await Spending_Model.findOne({
      where: {
        kddept: kddept,
        kdunit: kdunit,
        kdsatker: kdsatker,
        kddekon: kddekon,
        posisi: req.params.id,
      },
    });
    if (!query) return res.status(400).json({ msg: "Data Spending Not Found" });
  } catch (error) {
    console.log(error.message);
  }
  try {
    await Spending_Model.destroy({
      where: {
        kddept: kddept,
        kdunit: kdunit,
        kdsatker: kdsatker,
        kddekon: kddekon,
        posisi: req.params.id,
        kdreview: 1,
      },
    });

    const resultsQuery = `UPDATE spending_review.dt_pok_2024 SET STATUS='' WHERE kddept='${kddept}' AND kdunit='${kdunit}' AND kdsatker='${kdsatker}' AND kddekon='${kddekon}' and LEFT(kdindex, 36) = '${req.params.id}'`;
    await db.query(resultsQuery, {
      type: Sequelize.QueryTypes.UPDATE,
    });

    res.status(200).json({ msg: "Data Spending Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const simpanEinmlaigh = async (req, res) => {
  const {
    keterangan,
    kdindex,
    jenis,
    user,
    thang,
    uraian,
    kdkanwil,
    volkeg,
    satkeg,
    hargasat,
  } = req.body;
  let kddept = kdindex.substr(0, 3);
  let kdunit = kdindex.substr(3, 2);
  let kdsatker = kdindex.substr(5, 6);
  let kddekon = kdindex.substr(11, 1);
  if (!keterangan) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  const tigaenam = kdindex.length;

  // hapus data terlebih dahulu
  try {
    await Spending_Model.destroy({
      where: literal(
        `left(posisi, ${tigaenam}) = '${kdindex}' 
            and kddept= '${kddept}' 
            and kdunit= '${kdunit}'
            and kdsatker= '${kdsatker}'
            and kddekon= '${kddekon}' and kdreview='2'`
      ),
    });
  } catch (error) {
    console.log(error.message);
  }

  // update header
  try {
    const resultsQuery = `UPDATE spending_review.dt_pok_2024 SET header='false'  WHERE kddept='${kddept}' AND kdunit='${kdunit}' AND kdsatker='${kdsatker}' AND kddekon='${kddekon}' AND left(kdindex,${tigaenam}) = '${kdindex}'`;
    // console.log(resultsQuery);
    await db.query(resultsQuery, {
      type: Sequelize.QueryTypes.UPDATE,
    });
  } catch (error) {
    console.error("Error update:", error);
  }

  // insert data setelah hapus
  try {
    const result = await Pok_Model.findAll({
      attributes: [
        "kdindex",
        "kddept",
        "kdunit",
        "kdsatker",
        "kddekon",
        "uraian",
        "volkeg",
        "satkeg",
        "hargasat",
      ],
      where: literal(
        `left(kdindex, ${tigaenam}) = '${kdindex}'  and blokir=''
            and kddept= '${kddept}' 
            and kdunit= '${kdunit}'
            and kdsatker= '${kdsatker}'
            and kddekon= '${kddekon}'`
      ),
    });

    const spendingData = result.map((item) => ({
      thang: thang,
      kddept: item.kddept,
      kdunit: item.kdunit,
      kdsatker: item.kdsatker,
      kddekon: item.kddekon,
      kdprogram: item.kdindex.substr(12, 2),
      kdgiat: item.kdindex.substr(14, 4),
      kdoutput: item.kdindex.substr(18, 3),
      kdsoutput: item.kdindex.substr(21, 3),
      kdkmpnen: item.kdindex.substr(24, 3),
      kdskmpnen: item.kdindex.substr(27, 2),
      kdakun: item.kdindex.substr(29, 6),
      noitem: item.kdindex.substr(35, 1),
      nmitem: item.uraian,
      volkeg: item.volkeg ? item.volkeg : 0,
      satkeg: item.satkeg ? item.satkeg : 0,
      hargasat: item.hargasat ? item.hargasat : 0,
      jumlah: parseInt(item.volkeg * item.hargasat),
      inefisiensi: parseInt(0),
      kdreview: jenis,
      keterangan: keterangan,
      posisi: item.kdindex,
      kdkanwil: kdkanwil === "00" ? "KP" : kdkanwil,
      username: user,
    }));

    await Spending_Model.bulkCreate(spendingData);
    // update status2
    try {
      const resultsQuery = `UPDATE spending_review.dt_pok_2024 SET STATUS2='true'  WHERE kddept='${kddept}' AND kdunit='${kdunit}' AND kdsatker='${kdsatker}' AND kddekon='${kddekon}' AND LEFT(kdindex, ${tigaenam}) = '${kdindex}'`;

      await db.query(resultsQuery, {
        type: Sequelize.QueryTypes.UPDATE,
      });
    } catch (error) {
      console.error("Error update:", error);
    }
    // update header
    try {
      let resultsQuery;
      if (tigaenam === 36) {
        resultsQuery = `UPDATE spending_review.dt_pok_2024 SET header='true'  WHERE kddept='${kddept}' AND kdunit='${kdunit}' AND kdsatker='${kdsatker}' AND kddekon='${kddekon}' AND LEFT(kdindex, 36) = '${kdindex}'`;
      } else {
        resultsQuery = `UPDATE spending_review.dt_pok_2024 SET header='true'  WHERE kddept='${kddept}' AND kdunit='${kdunit}' AND kdsatker='${kdsatker}' AND kddekon='${kddekon}' AND kdindex = '${kdindex}'`;
      }
      console.log(resultsQuery);
      await db.query(resultsQuery, {
        type: Sequelize.QueryTypes.UPDATE,
      });
    } catch (error) {
      console.error("Error update:", error);
    }
    try {
      await Spending_Model.destroy({
        where: literal(
          `kddept= '${kddept}' 
              and kdunit= '${kdunit}'
              and kdsatker= '${kdsatker}'
              and kddekon= '${kddekon}'  and kdreview='2' and noitem=''`
        ),
      });
    } catch (error) {
      console.log(error.message);
    }
    res.status(200).json({ msg: "Data Successfuly Saved" });
  } catch (error) {
    console.error("Error saving:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const hapusEinmaligh = async (req, res) => {
  let kddept = req.params.id.substr(0, 3);
  let kdunit = req.params.id.substr(3, 2);
  let kdsatker = req.params.id.substr(5, 6);
  let kddekon = req.params.id.substr(11, 1);
  const tigaenam = req.params.id.length;

  try {
    await Spending_Model.destroy({
      where: literal(
        `left(posisi, ${tigaenam}) = '${req.params.id}' 
            and kddept= '${kddept}' 
            and kdunit= '${kdunit}'
            and kdsatker= '${kdsatker}'
            and kddekon= '${kddekon}'  and kdreview='2'`
      ),
    });

    const resultsQuery = `UPDATE spending_review.dt_pok_2024 SET STATUS2='false',header='false' WHERE kddept='${kddept}' AND kdunit='${kdunit}' AND kdsatker='${kdsatker}' AND kddekon='${kddekon}' AND LEFT(kdindex, ${tigaenam}) = '${req.params.id}'`;
    await db.query(resultsQuery, {
      type: Sequelize.QueryTypes.UPDATE,
    });

    res.status(200).json({ msg: "Data Spending Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const ubahStatusSatker = async (req, res) => {
  try {
    const query = await Status_Model.update(
      {
        status: req.params.flag === "true" ? "false" : "true",
      },
      {
        where: {
          kdsatker: req.params.kdsatker,
        },
      }
    );

    return res.status(200).json({ msg: "Status updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

import Sequelize, { Op, literal, where } from "sequelize";

import db from "../../config/Database6.js";
import Iku_Model from "../../models/iku/Iku_Model.js";
import Iku_Model2 from "../../models/iku/Iku_Model2.js";
import Iku_Kppn_Model from "../../models/iku/Iku_Kppn_Model.js";
export const simpanIku = async (req, res) => {
  try {
    const {
      ringkasan2,
      penyusunan2,
      metode2,
      kualitasdf2,
      kualitasbos2,
      kualitasdd2,
      kesimpulan2,
      ket,
      periode,
      thang,
      kdkanwil,
      analisa,
      username,
    } = req.body;

    let bobotkualitasdd, bobotkualitasdf, bobotkualitasbos;
    if (req.body.kdkanwil === "11") {
      bobotkualitasdf = ((kualitasdf2 * 50) / 100).toFixed(0);
      bobotkualitasdd = 0;
      bobotkualitasbos = ((kualitasbos2 * 10) / 100).toFixed(0);
    } else {
      bobotkualitasdd = ((kualitasdd2 * 25) / 100).toFixed(0);
      bobotkualitasdf = ((kualitasdf2 * 25) / 100).toFixed(0);
      bobotkualitasbos = ((kualitasbos2 * 10) / 100).toFixed(0);
    }

    // Menghitung bobot untuk ringkasan, penyusunan, metode, dan kesimpulan
    const bobotringkasan = ((ringkasan2 * 15) / 100).toFixed(0);
    const bobotpenyusunan = ((penyusunan2 * 5) / 100).toFixed(0);
    const bobotmetode = ((metode2 * 5) / 100).toFixed(0);
    const bobotkesimpulan = ((kesimpulan2 * 10) / 100).toFixed(0);

    // Menghitung hasil
    const hasil =
      parseInt(bobotringkasan) +
      parseInt(bobotpenyusunan) +
      parseInt(bobotmetode) +
      parseInt(bobotkesimpulan) +
      parseInt(bobotkualitasdd) +
      parseInt(bobotkualitasdf) +
      parseInt(bobotkualitasbos);

    let newData;

    if (analisa === "I") {
      // console.log(bobotkesimpulan);
      try {
        const result = await Iku_Model.findOne({
          where: {
            kdkanwil: kdkanwil,
            thang: thang,
            periode: periode,
          },
        });

        if (result) {
          newData = await Iku_Model.update(
            {
              ringkasan: ringkasan2,
              penyusunan: penyusunan2,
              metode: metode2,
              kualitasdf: kualitasdf2,
              kualitasbos: kualitasbos2,
              kualitasdd: kualitasdd2,
              kesimpulan: kesimpulan2,
              ket: ket,
              hasil: hasil,
              periode: periode,
              thang: thang,
              kdkanwil: kdkanwil,
              username,
            },
            {
              where: {
                kdkanwil: kdkanwil,
                thang: thang,
                periode: periode,
              },
            }
          );
        } else {
          newData = await Iku_Model.create({
            ringkasan: ringkasan2,
            penyusunan: penyusunan2,
            metode: metode2,
            kualitasdf: kualitasdf2,
            kualitasbos: kualitasbos2,
            kualitasdd: kualitasdd2,
            kesimpulan: kesimpulan2,
            ket: ket,
            hasil: hasil,
            periode: periode,
            thang: thang,
            kdkanwil: kdkanwil,
            username,
          });
        }
      } catch (error) {
        console.error("Error cek data:", error);
      }
    } else {
      const result = await Iku_Model2.findOne({
        where: {
          kdkanwil: kdkanwil,
          thang: thang,
          periode: periode,
        },
      });

      if (result) {
        newData = await Iku_Model2.update(
          {
            ringkasan: ringkasan2,
            penyusunan: penyusunan2,
            metode: metode2,
            kualitasdf: kualitasdf2,
            kualitasbos: kualitasbos2,
            kualitasdd: kualitasdd2,
            kesimpulan: kesimpulan2,
            ket: ket,
            hasil: hasil,
            periode: periode,
            thang: thang,
            kdkanwil: kdkanwil,
            username,
          },
          {
            where: {
              kdkanwil: kdkanwil,
              thang: thang,
              periode: periode,
            },
          }
        );
      } else {
        newData = await Iku_Model2.create({
          ringkasan: ringkasan2,
          penyusunan: penyusunan2,
          metode: metode2,
          kualitasdf: kualitasdf2,
          kualitasbos: kualitasbos2,
          kualitasdd: kualitasdd2,
          kesimpulan: kesimpulan2,
          ket: ket,
          hasil: hasil,
          periode: periode,
          thang: thang,
          kdkanwil: kdkanwil,
          username,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Data berhasil disimpan",
      data: newData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menyimpan data",
    });
  }
};

export const simpanIkuKPPN = async (req, res) => {
  try {
    const {
      jelaslengkap,
      jelassesuai,
      sahlengkap,
      sahsesuai,
      calklengkap,
      calksesuai,
      tabellengkap,
      tabelsesuai,
      lamplengkap,
      lampsesuai,
      username,
      kdkppn,
      thang,
      periode,
    } = req.body;

    const result = await Iku_Kppn_Model.findOne({
      where: {
        kdkppn: kdkppn,
        periode: periode,
        thang: thang,
      },
    });

    if (result) {
      await Iku_Kppn_Model.destroy({
        where: {
          kdkppn: kdkppn,
          periode: periode,
          thang: thang,
        },
      });
    }

    const newNilaiLaporan = await Iku_Kppn_Model.create({
      jelaslengkap,
      jelassesuai,
      sahlengkap,
      sahsesuai,
      calklengkap,
      calksesuai,
      tabellengkap,
      tabelsesuai,
      lamplengkap,
      lampsesuai,
      username,
      kdkppn,
      thang,
      periode,
    });

    res.status(201).json({
      message: "Nilai laporan berhasil dibuat",
      data: newNilaiLaporan,
    });
  } catch (error) {
    console.error("Error saat membuat nilai laporan:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat membuat nilai laporan" });
  }
};

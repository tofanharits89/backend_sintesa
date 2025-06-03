import Sequelize from "sequelize";
import Log_menu from "../models/Log_menu.js";
import Setting from "../models/Setting.js";

export const ubahSetting = async (req, res) => {
  const {
    mode,
    status,
    opsitampilkan,
    opsitampilkanverify,
    session,
    captcha,
    verify,
  } = req.body;
  const tampil = Boolean(opsitampilkan);
  const tampilverify = Boolean(opsitampilkanverify);
  // console.log(req.body);

  try {
    const updatedSetting = await Setting.update(
      {
        mode,
        status,
        session,
        capcay: captcha,
        tampil: tampil,
        tampilverify,
        verify,
      },
      {
        where: {
          id: 1,
        },
      }
    );

    if (updatedSetting[0] === 1) {
      res.status(200).json({ message: "Setting Berhasil" });
    } else {
      res.status(200).json({ message: "Tidak ada yang diupdate" });
    }
  } catch (error) {
    res.json({ message: "Setting Gagal" });
  }
};

export const getSetting = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getMode = async (req, res) => {
  try {
    const settings = await Setting.findOne({
      attributes: ["capcay"],
      where: { id: 1 },
    });
    console.log("Hasil Query:", settings);

    if (!settings) {
      return res.status(404).json({ error: "Setting not found" });
    }

    // Coba kirim manual, pastikan bukan instance
    res.json({ capcay: String(settings.capcay) }); // atau tanpa String jika memang sudah string
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const log_menu = async (req, res) => {
  try {
    const result = await Log_menu.findAll({
      attributes: [
        "nm_menu",
        "ip",
        [Sequelize.fn("COUNT", Sequelize.col("*")), "hit"],
      ],
      group: ["nm_menu"],
      order: [[Sequelize.literal("hit"), "DESC"]],
    });

    const responseData = result.map((item) => ({
      nm_menu: item.nm_menu,
      hit: item.getDataValue("hit"),
      ip: item.ip,
    }));

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

import Users from "../../models/UserModel.js";
import User_log from "../../models/User_log.js";
import Setting from "../../models/Setting.js";
import jwt from "jsonwebtoken";
import User_role from "../../models/User_role.js";
import moment from "moment-timezone";
import Login_status from "../../models/Login_status.js";
import Sequelize from "sequelize";
import Encrypt from "../../acak/Random.js";
const { Op } = Sequelize;
import ioServer from "../../index.js";
import Otp_Models from "../../models/Otp/pending_pin.js";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const LoginPIN = async (req, res) => {
  try {
    const { otp } = req.body;

    // Cek PIN dalam database
    const cekUser = await Otp_Models.findOne({
      where: { pin: otp, status: "OK" },
    });

    if (!cekUser) {
      return res
        .status(200)
        .json({ success: false, msg: "PIN tidak ditemukan" });
    }

    // Cek user berdasarkan username yang didapat dari cekUser
    const user = await Users.findOne({
      where: { username: cekUser.username, verified: "TRUE" },
    });

    if (!user) {
      return res
        .status(200)
        .json({ success: false, msg: "User tidak ditemukan" });
    }

    const {
      id: userId,
      name,
      username,
      role,
      kdkanwil,
      kdkppn,
      kdlokasi,
      active,
      dept_limit,
      url,
      telp,
      verified,
    } = user;

    function formatDateToMySQL(date) {
      return date.toISOString().slice(0, 19).replace("T", " ");
    }

    // Update tgl_login
    await Users.update(
      {
        tgl_login: moment(formatDateToMySQL(new Date()))
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        where: { username },
      }
    );

    // Ambil nama role dari tabel User_role
    const nm_role = await User_role.findOne({
      where: { kdrole: role },
    });
    const namarole = nm_role?.nmrole || "";

    // Ambil informasi IP dan user-agent dari request
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];
    moment.tz.setDefault("Asia/Jakarta");
    const saiki = moment().format("YYYY-MM-DD HH:mm:ss");

    // Simpan log user
    req.session.username = username;
    req.session.name = name;
    req.session.ip = clientIP;

    if (username) {
      await User_log.create({
        username,
        date_login: saiki,
        ip: clientIP,
        browser: userAgent,
        name,
        login_by: "PIN",
      });

      // Hapus status login lain yang berbeda IP
      await Login_status.destroy({
        where: {
          username,
          ip: { [Op.ne]: clientIP },
        },
      });

      // Simpan status login baru
      await Login_status.create({
        username,
        status: "TRUE",
        ip: clientIP,
        date: saiki,
      });
    }

    // Kirim pesan WhatsApp setelah login sukses

    const setting = await Setting.findOne({ where: { id: 1 } });

    const { mode, tampil, tampilverify, status, session, capcay } = setting;

    console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
    const accessToken = jwt.sign(
      {
        mode,
        tampil,
        tampilverify,
        status,
        username,
        url,
        userId,
        kdlokasi,
        kdkanwil,
        kdkppn,
        name,
        role,
        active,
        dept_limit,
        namarole,
        session,
        telp,
        capcay,
        verified,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign(
      {
        mode,
        tampil,
        tampilverify,
        status,
        username,
        url,
        userId,
        name,
        role,
        kdlokasi,
        kdkanwil,
        kdkppn,
        active,
        dept_limit,
        namarole,
        session,
        capcay,
        telp,
        verified,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const tokenSet = Encrypt(refreshToken);
    const tokenSetLogin = Encrypt(accessToken);

    await Users.update({ refresh_token: tokenSet }, { where: { id: userId } });

    ioServer.emit("userLoggedin", username);
    ioServer.emit("nmuser", name);
    ioServer.emit("loginBy", "PIN");

    res.cookie("accessToken", tokenSet, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "strict",
    });
    return res.json({ success: true, tokenSetLogin });
  } catch (error) {
    console.log("Error saat login:", error); // Logging error detail
    return res.status(500).json({
      success: false,
      msg: "Terjadi kesalahan saat login: " + error.message,
    });
  }
};

import Users from "../models/UserModel.js";
import User_log from "../models/User_log.js";
import Setting from "../models/Setting.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/Database.js";
import User_role from "../models/User_role.js";
import moment from "moment-timezone";
import Login_status from "../models/Login_status.js";
import Sequelize from "sequelize";
import Encrypt from "../acak/Random.js";
const { Op } = Sequelize;
import ioServer from "../index.js";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: [
        "id",
        "name",
        "username",
        "role",
        "kdkanwil",
        "kdkppn",
        "kdlokasi",
        "active",
        "email",
        "tgl_login",
        "orderdata",
        "verified",
        "url",
      ],
      order: [
        ["orderdata", "DESC"],
        ["role", "DESC"],
      ],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const checkUser = async (req, res) => {
  const { username } = req.query;
  try {
    const user = await Users.findOne({ where: { username } });
    if (user) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editUser = async (req, res) => {
  const { id, username, name, password, confPassword, role, email } = req.body;
  // const salt = await bcrypt.genSalt();
  // const hashPassword = await bcrypt.hash(password, salt);
  try {
    // Cari pengguna berdasarkan ID
    const user = await Users.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Users.update(
      {
        username,
        name,
        // password: hashPassword,
        confPassword,
        role,
        email,
      },
      {
        where: {
          id,
        },
      }
    );

    const updatedUser = await Users.findOne({ where: { id } });

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await Users.destroy({ where: { id: userId } });
    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus user" });
  }
};

export const Register = async (req, res) => {
  const { name, username, email, role, password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });
  // const salt = await bcrypt.genSalt();
  // const hashPassword = await bcrypt.hash(password, salt);
  const cekuser = await Users.findOne({ where: { username } });
  if (cekuser) {
    return res.status(500).json({ message: "User Sudah Ada" });
  }
  try {
    await Users.create({
      name: name,
      role: role,
      email: email,
      username: username,
      password: password,
    });
    res.json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  console.log('LOGIN REQUEST:', req.body)
  try {
    const user = await Users.findAll({
      where: {
        username: req.body.username,
      },
    });
    if (!user || user.length === 0) {
      return res
        .status(200)
        .json({ success: false, msg: "User tidak ditemukan" });
    }
    const match = (await req.body.password) === user[0].password;
    if (!match) {
      return res
        .status(200)
        .json({ success: false, msg: "Password Anda Tidak Sesuai" });
    }

    const userId = user[0].id;
    const name = user[0].name;
    const username = user[0].username;
    const role = user[0].role;
    const kdkanwil = user[0].kdkanwil;
    const kdkppn = user[0].kdkppn;
    const kdlokasi = user[0].kdlokasi;
    const active = user[0].active;
    const dept_limit = user[0].dept_limit;
    const url = user[0].url;
    const verified = user[0].verified;
    const telp = user[0].telp;

    function formatDateToMySQL(date) {
      return date.toISOString().slice(0, 19).replace("T", " ");
    }

    const ubahtime = await Users.update(
      {
        tgl_login: moment(formatDateToMySQL(new Date()))
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        where: {
          username,
        },
      }
    );
    // console.log("ubah updatedAt:" + formatDateToMySQL(new Date()));
    const nm_role = await User_role.findAll({
      where: {
        kdrole: role,
      },
    });
    const namarole = nm_role[0].nmrole;
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];
    moment.tz.setDefault("Asia/Jakarta");
    const saiki = moment().format("YYYY-MM-DD HH:mm:ss");

    req.session.username = username;
    req.session.name = name;
    req.session.ip = clientIP;

    if (typeof username !== "undefined") {
      await User_log.create({
        username: username,
        date_login: saiki,
        ip: clientIP,
        browser: userAgent,
        name: name,
        login_by: "REGULAR",
      });

      await Login_status.destroy({
        where: {
          username,
          ip: { [Op.ne]: clientIP }, // Operator 'ne' untuk 'not equal'
        },
      });
      await Login_status.create({
        username: username,
        status: "TRUE",
        ip: clientIP,
        date: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
      });
    }

    const setting = await Setting.findOne({
      where: {
        id: 1,
      },
    });

    const ubahStatus = await Users.update({ online: false }, { where: {} });

    const mode = setting.mode;
    const tampil = setting.tampil;
    const tampilverify = setting.tampilverify;
    const status = setting.status;
    const session = setting.session;
    const capcay = setting.capcay;
    const accessToken = jwt.sign(
      {
        telp,
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
        username,
        role,
        active,
        dept_limit,
        namarole,
        session,
        capcay,
        verified,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        // expiresIn: "20m",
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      {
        telp,
        mode,
        tampil,
        tampilverify,
        status,
        username,
        url,
        userId,
        name,
        username,
        role,
        kdlokasi,
        kdkanwil,
        kdkppn,
        active,
        dept_limit,
        namarole,
        session,
        capcay,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const tokenSet = Encrypt(refreshToken);
    const tokenSetLogin = Encrypt(accessToken);
    await Users.update(
      { refresh_token: tokenSet },
      {
        where: {
          id: userId,
        },
      }
    );
    ioServer.emit("userLoggedin", username);
    ioServer.emit("nmuser", name);
    ioServer.emit("loginBy", "REGULAR");

    res.cookie("accessToken", tokenSet, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true, // Cookie will only be sent over HTTPS
      sameSite: "strict", // This helps to prevent CSRF attacks
    });

    return res.json({ success: true, tokenSetLogin });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "Terjadi kesalahan saat login" + error });
  }
};

export const Logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to destroy session" });
    }
    res.clearCookie("accessToken");
    return res.sendStatus(200);
  });
};

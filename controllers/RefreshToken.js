import Users from "../models/UserModel.js";
import Setting from "../models/Setting.js";
import jwt from "jsonwebtoken";
import { decryptData } from "../middleware/Decrypt.js";
import Encrypt from "../acak/Random.js";
import User_role from "../models/User_role.js";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.accessToken;

    if (!refreshToken)
      return res.status(404).json({
        msg: "error refresh token ",
      });
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0])
      return res
        .status(404)
        .json({ msg: "error refresh token {user tidak ditemukan}" });

    const setting = await Setting.findOne({
      where: {
        id: 1,
      },
    });
    const mode = setting.mode;
    const tampil = setting.tampil;
    const tampilverify = setting.tampilverify;
    const status = setting.status;
    const session = setting.session;
    const capcay = setting.capcay;

    const refreshTokenDecript = decodeURIComponent(
      decryptData(refreshToken).replace(/"/g, "")
    );

    const nm_role = await User_role.findAll({
      where: {
        kdrole: user[0].role,
      },
    });
    const namarole = nm_role[0].nmrole;

    jwt.verify(
      refreshTokenDecript,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err)
          return res.status(404).json({
            msg: "error refresh token {terdapat masalah dalam sign jwt}",
          });
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const active = user[0].active;
        const role = user[0].role;
        const kdkanwil = user[0].kdkanwil;
        const kdkppn = user[0].kdkppn;
        const kdlokasi = user[0].kdlokasi;
        const username = user[0].username;
        const url = user[0].url;
        const verified = user[0].verified;
        const telp = user[0].telp;

        const accessToken2 = jwt.sign(
          {
            telp,
            active,
            url,
            userId,
            name,
            email,
            role,
            kdkanwil,
            kdkppn,
            kdlokasi,
            username,
            mode,
            tampil,
            tampilverify,
            status,
            session,
            capcay,
            namarole,
            verified,
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        const encryptedToken = Encrypt(accessToken2);

        res.json({ accessToken: encryptedToken });
        //console.log(accessToken2);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

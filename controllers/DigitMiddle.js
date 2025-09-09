import Users from "../models/UserModel.js";
import User_log from "../models/User_log.js";
import Setting from "../models/Setting.js";
import jwt from "jsonwebtoken";
import User_role from "../models/User_role.js";
import moment from "moment-timezone";
import Login_status from "../models/Login_status.js";
import Sequelize from "sequelize";
import Encrypt from "../acak/Random.js";
import axios from "axios";
const { Op } = Sequelize;
import ioServer from "../index.js";
import db from "../config/Database.js";
// import cookieParser from "cookie-parser";

export const digitMiddle = async (req, res) => {
  console.log("=== [digitMiddle] called ===");
  console.log("req.url:", req.url);
  console.log("req.query:", req.query);
  console.log("env DIGIT_BASE_URL:", process.env.DIGIT_BASE_URL);
  try {
    // let { code, state } = req.query;
    let { email, username, name, code, state, error } = req.query;
    // new: nip akan diisi dari provider response atau decoded token
    let nip = null;
    // Client ID for DIGIT (prefer env var, fallback to known value)
    const clientId = "d58f9bf1-8714-4254-a546-6435635786cf";
    const client_secret = "e148f2ae19997a139ef7692cc2833f2b8faab3d3";
    const frontendBase =
      (process.env.VITE_PUBLIC_URL || "http://localhost").replace(/\/$/, "") +
      "/v3";
    const digitBase = (
      process.env.DIGIT_BASE_URL || "http://10.216.83.10"
    ).replace(/\/$/, "");
    const REDIRECT_URI =
      process.env.DIGIT_REDIRECT_URI ||
      "http://localhost:88/v3/auth/digit/middle";

    // try {
    //   if (state === "123") {
    //     req.session = req.session || {};
    //     req.session.oauth_state = "123";
    //     console.log("[digitMiddle] TEST: set req.session.oauth_state = '123'");
    //   }
    // } catch (sessErr) {
    //   console.warn(
    //     "[digitMiddle] TEST: gagal set test session state:",
    //     sessErr && sessErr.message
    //   );
    // }

    // Check for OAuth errors first
    if (error) {
      // console.log("[digitMiddle] OAuth error from provider:", error);
      // const frontendBase =
      (process.env.VITE_PUBLIC_URL || "http://localhost") + "/v3";
      return res.redirect(`${frontendBase}/auth/login?error=oauth_${error}`);
    }

    // LANGKAH 1: Jika tidak ada code, redirect ke provider untuk authorize (sesuai dokumentasi)
    if (!code && state) {
      // const REDIRECT_URI =
      process.env.DIGIT_REDIRECT_URI ||
        "http://localhost:88/v3/auth/digit/middle";

      // Store state di session untuk validasi nanti
      if (req.session) {
        req.session.oauth_state = state;
        // console.log("[digitMiddle] stored state in session:", state);
      }

      // Format URL sesuai dokumentasi DIGIT: http://10.216.83.10/oauth2?response_type=code&client_id=...
      // const digitBase = process.env.DIGIT_BASE_URL || "http://10.216.83.10";
      const authUrl = `${digitBase}/oauth2?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&state=${state}`;

      // console.log(
      //   "[digitMiddle] redirecting to provider authorize URL:",
      //   authUrl
      // );
      return res.redirect(authUrl);
    }

    // LANGKAH 2-3: Jika ada code, lakukan validasi state dan token exchange
    if (code) {
      // LANGKAH 3: Validasi state parameter (CSRF protection)
      if (req.session?.oauth_state && req.session.oauth_state !== state) {
        // console.log("[digitMiddle] state mismatch - possible CSRF attack");
        // console.log("[digitMiddle] session state:", req.session.oauth_state);
        // console.log("[digitMiddle] received state:", state);
        // const frontendBase =
        (process.env.VITE_PUBLIC_URL || "http://localhost") + "/v3";
        return res.redirect(`${frontendBase}/auth/login?error=state_mismatch`);
      }

      // TAMBAH ini setelah validasi berhasil:
      if (req.session?.oauth_state) {
        delete req.session.oauth_state;
        // console.log(
        //   "[digitMiddle] state validation successful, cleared session"
        // );
      }

      // LANGKAH 4: Token exchange sesuai dokumentasi DIGIT
      // const REDIRECT_URI =
      //   process.env.DIGIT_REDIRECT_URI ||
      //   "http://localhost:88/v3/auth/digit/middle";
      const CLIENT_SECRET = process.env.DIGIT_CLIENT_SECRET || client_secret;

      const tokenBody = {
        grant_type: "code",
        code: code,
        redirect_uri: REDIRECT_URI, // Harus sama dengan yang digunakan di authorize
        client_id: clientId,
        client_secret: CLIENT_SECRET,
      };

      let tokenRes;
      try {
        // console.log("[digitMiddle] sending token exchange request...");
        tokenRes = await axios.post(
          `${digitBase}/oauth2/api/access-token`,
          tokenBody,
          {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
          }
        );
        // console.log(
        //   "[digitMiddle] tokenRes.status, tokenRes.data:",
        //   tokenRes.status,
        //   tokenRes.data
        // );
      } catch (err) {
        console.error(
          "[digitMiddle] token exchange error:",
          err.response?.data || err.message
        );
        return res.redirect(`${frontendBase}/auth/login?error=token_exchange`);
      }

      // LANGKAH 5: Ambil access_token dan user_id
      if (!tokenRes?.data || tokenRes.data.code !== "00") {
        console.error(
          "[digitMiddle] token endpoint returned error:",
          tokenRes?.data
        );
        return res.redirect(
          `${frontendBase}/auth/login?error=token_exchange_failed`
        );
      }

      const accessToken = tokenRes.data.access_token;
      const userId = tokenRes.data.user_id || tokenRes.data.id_user;

      // LANGKAH 6: GET user data menggunakan access_token (sesuai dokumentasi DIGIT)
      if (userId && accessToken) {
        try {
          // console.log(
          //   "[digitMiddle] fetching user data from /oauth2/api/user/" + userId
          // );

          // Format header Authorization sesuai dokumentasi: "Bearer " + access_token
          const authHeader = "Bearer " + accessToken;
          // console.log(
          //   "[digitMiddle] using Authorization header:",
          //   authHeader.substring(0, 20) + "..."
          // );

          const userRes = await axios({
            method: "get",
            url: `${digitBase}/oauth2/api/user/${userId}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader,
            },
            timeout: 10000,
          });

          // console.log("[digitMiddle] userRes.status:", userRes.status);
          // console.log("[digitMiddle] userRes.data:", userRes.data);

          // Parse response data - bisa berupa data langsung atau wrapped dalam property
          const userData = userRes.data?.data || userRes.data;

          // Coba berbagai kemungkinan field name dari response DIGIT
          username =
            userData?.username ||
            userData?.user ||
            userData?.User ||
            userData?.USERNAME ||
            null;
          email =
            userData?.email ||
            userData?.Email ||
            userData?.EMail ||
            userData?.EMAIL ||
            null;
          name =
            userData?.name ||
            userData?.nama ||
            userData?.Name ||
            userData?.NAMA ||
            userData?.full_name ||
            userData?.fullname ||
            null;
          // Ambil NIP bila provider menyediakannya (coba beberapa kemungkinan nama field)
          nip =
            userData?.nip ||
            userData?.NIP ||
            userData?.nip_baru ||
            userData?.employee_id ||
            userData?.emp_id ||
            null;

          // console.log("[digitMiddle] parsed user data:", {
          //   username,
          //   email,
          //   name,
          //   rawUserData: userData,
          // });
        } catch (err) {
          console.error(
            "[digitMiddle] error fetching user data:",
            err.response?.status,
            err.response?.data || err.message
          );

          // Fallback: decode JWT access_token jika endpoint user gagal
          try {
            // console.log(
            //   "[digitMiddle] attempting to decode access_token as fallback..."
            // );
            const decoded = jwt.decode(accessToken);
            // console.log(
            //   "[digitMiddle] decoded access_token payload (fallback):",
            //   decoded
            // );
            username =
              username ||
              decoded?.username ||
              decoded?.user ||
              decoded?.User ||
              null;
            email =
              email ||
              decoded?.email ||
              decoded?.Email ||
              decoded?.EMail ||
              null;
            nip =
              nip ||
              decoded?.nip ||
              decoded?.NIP ||
              decoded?.employee_id ||
              decoded?.emp_id ||
              null;
            name =
              name || decoded?.name || decoded?.nama || decoded?.Name || null;

            // console.log("[digitMiddle] fallback data from token:", {
            //   username,
            //   email,
            //   name,
            // });
          } catch (decodeErr) {
            console.warn(
              "[digitMiddle] failed to decode access token:",
              decodeErr.message
            );
          }
        }
      } else {
        console.warn(
          "[digitMiddle] missing userId or accessToken for user data fetch"
        );
      }
    }

    // Check if we have required identifiers after processing
    // if (!email && !username) {
    if (!email && !username && !nip) {
      // console.log(
      //   "[digitMiddle] missing identifiers after exchange, req.query:",
      //   req.query
      // );
      return res.redirect(
        `${frontendBase}/auth/login?error=missing_identifier`
      );
    }

    // LANGKAH 7: Cek DB lokal berdasarkan identifier (email/username)
    let localUser = null;

    // Try username first (most common case for Digit)
    if (username) {
      localUser = await Users.findOne({ where: { username: username } });
    }

    // If not found by username and we have email, try email
    if (!localUser && email) {
      localUser = await Users.findOne({ where: { email: email } });
    }

    // console.log(
    //   "[digitMiddle] DB lookup result:",
    //   localUser ? "Found user" : "User not found",
    //   "for identifiers:",
    //   { email, username }
    // );

    if (localUser) {
      // User sudah terdaftar - update login time dan buat session/JWT
      const userId = localUser.id;
      const name = localUser.name;
      const username = localUser.username;
      const role = localUser.role;
      const kdkanwil = localUser.kdkanwil;
      const kdkppn = localUser.kdkppn;
      const kdlokasi = localUser.kdlokasi;
      const active = localUser.active;
      const dept_limit = localUser.dept_limit;
      const url = localUser.url;
      const verified = localUser.verified;
      const telp = localUser.telp;

      function formatDateToMySQL(date) {
        return date.toISOString().slice(0, 19).replace("T", " ");
      }

      // Update login time
      await Users.update(
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

      // Get role name
      const nm_role = await User_role.findAll({
        where: {
          kdrole: role,
        },
      });
      const namarole = nm_role[0]?.nmrole || "";

      // Get client info
      const clientIP =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const userAgent = req.headers["user-agent"];
      moment.tz.setDefault("Asia/Jakarta");
      const saiki = moment().format("YYYY-MM-DD HH:mm:ss");

      // Create login log
      await User_log.create({
        username: username,
        date_login: saiki,
        ip: clientIP,
        browser: userAgent,
        name: name,
        login_by: "DIGIT_OAUTH",
      });

      // Update login status
      await Login_status.destroy({
        where: {
          username,
          ip: { [Op.ne]: clientIP },
        },
      });
      await Login_status.create({
        username: username,
        status: "TRUE",
        ip: clientIP,
        date: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
      });

      // Get settings
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

      // Create tokens
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

      // Emit socket events
      ioServer.emit("userLoggedin", username);
      ioServer.emit("nmuser", name);
      ioServer.emit("loginBy", "DIGIT_OAUTH");
      // console.log("User logged in:", username);

      // Set cookies
      res.cookie("accessToken", tokenSet, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Redirect berdasarkan role
      const adminRoles = ["1", "0", "X", "2"];
      const destination = adminRoles.includes(String(localUser.role))
        ? `${frontendBase}/landing/profile?digit_status=success`
        : `${frontendBase}/data/form/belanja`;

      // return res.status(200).json({
      //   destination,
      //   status: true, // Add any additional data you want to return
      // });

      return res.redirect(destination);
    } else {
      // User belum terdaftar - redirect ke frontend form registrasi dengan query params
      const queryParams = new URLSearchParams();
      if (email) queryParams.append("email", email);
      if (username) queryParams.append("username", username);
      if (name) queryParams.append("name", name);
      // const frontendBase =
      //   (process.env.VITE_PUBLIC_URL || "http://localhost") + "/v3";
      const frontendBase = "http://localhost/v3";
      const frontendRegisterUrl = `${frontendBase}/auth/register/digit${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      return res.redirect(frontendRegisterUrl);
    }
  } catch (error) {
    console.error("Error in digitMiddle:", error);
    return res.redirect(`${frontendBase}/auth/login?error=server_error`);
  }
};

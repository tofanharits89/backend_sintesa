import express from "express";
import https from "https";
import fs from "fs";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import db from "./config/Database.js";
import router from "./routes/index.js";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import { errorHandler } from "./middleware/VerifyToken.js";
import Users from "./models/UserModel.js";
import path from "path";
import { fileURLToPath } from "url";
import Isu_Model from "./models/kinerja/isumodel.js";
import RekamBPS from "./models/rekambps_model.js";
import RekamBapanas from "./models/rekambapanas_model.js";
import RekamTriwulan from "./models/rekamtriwulan_model.js";
// --- Tambahkan router replypesan di sini:
import replypesanRoutes from "./routes/replypesan.js";
import ReplyPesan from "./models/replypesan.js";



dotenv.config();

// Konversi __dirname untuk ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inisialisasi express
const app = express();
app.disable("x-powered-by");

// Sertifikat SSL
const privateKey = fs.readFileSync("./ssl/localhost-key.pem", "utf8");
const certificate = fs.readFileSync("./ssl/localhost.pem", "utf8");

const credentials = {
  key: privateKey,
  cert: certificate,
};

// Membuat HTTPS server
const server = https.createServer(credentials, app);

// // Koneksi dan sinkron DB
// try {
//   await db.authenticate();
//   console.log("✅ Koneksi ke database berhasil.");

//   await Isu_Model.sync({ alter: true });
//   console.log("✅ Tabel 'isu' disinkronkan (dibuat jika belum ada).");
// } catch (error) {
//   console.error("❌ Gagal koneksi atau sinkronisasi:", error);
// }

// Middleware umum
app.use(express.static("public"));
app.use(compression());
app.use(cookieParser());
app.use(express.json());

// Session config
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({ db: db });

const expressSession = session({
  secret: "mebe23",
  resave: false,
  saveUninitialized: false,
  store: store,
});

app.use(expressSession);

// CORS config
const corsOptions = {
  credentials: true,
  methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
  origin: [
    "https://192.168.0.13",
    "https://10.216.208.135",
    "https://10.191.66.80",
    "https://localhost",
    "https://sintesa.kemenkeu.go.id",
  ],
};

app.use(cors(corsOptions));

// Router utama
app.use("", router);

// Middleware error handler
app.use(errorHandler);

// Jalankan HTTPS server
const port = process.env.PORT || 88;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Socket.IO
const ioServer = new Server(server, {
  cors: corsOptions,
});

let mySession;
let ip;

app.use((req, res, next) => {
  mySession = req.session.name || "guest";
  ip = req.session.ip;
  next();
});

ioServer.on("connection", async (socket) => {
  if (mySession) {
    try {
      const currentTime = new Date();
      const user = await Users.findOne({
        where: { name: mySession, online: "true" },
      });

      if (user && user.online) {
        const updatedAtTimeDiff = currentTime - new Date(user.updatedAt);
        if (updatedAtTimeDiff > 5 * 60 * 1000) {
          await Users.update(
            { online: "false" },
            { where: { name: mySession } }
          );
        }
      }

      await Users.update(
        { online: "true", ip: ip },
        { where: { name: mySession } }
      );

      ioServer.emit("statusberubah", new Date());
    } catch (error) {
      console.error(error);
    }
  }

  socket.on("disconnect", async () => {
    if (mySession) {
      try {
        await Users.update(
          { online: false, ip: ip },
          { where: { name: mySession } }
        );
        ioServer.emit("statusberubah", new Date());
      } catch (error) {
        console.error(error);
      }
    }
  });
});

// Folder publik khusus
app.use(
  "/monev_pnbp",
  express.static(path.join(__dirname, "public/monev_pnbp"))
);

// Export ioServer jika diperlukan di tempat lain
export default ioServer;

//DB kertas kerja MBG
// try {
//   await db.authenticate();
//   console.log("✅ Koneksi ke database berhasil.");

//   // await Isu_Model.sync({ alter: true });
//   // await RekamBPS.sync({ alter: true });
//   // await RekamBapanas.sync({ alter: true });
//   // await RekamTriwulan.sync({ alter: true });

//   console.log("✅ Semua tabel disinkronkan.");
// } catch (error) {
//   console.error("❌ Gagal koneksi atau sinkronisasi:", error);
// }



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

dotenv.config();
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});

const app = express();
app.disable("x-powered-by");

// Load SSL certificate files
const privateKey = fs.readFileSync("./ssl/sintesa_kemenkeu_go_id.key", "utf8");
const certificate = fs.readFileSync("./ssl/sintesa_kemenkeu_go_id.crt", "utf8");

const credentials = {
  key: privateKey,
  cert: certificate,
  // ca: ca,
};

// Create HTTPS server
const server = https.createServer(credentials, app);

try {
  await db.authenticate();
  console.log("Database Connected...");
} catch (error) {
  console.error(error);
}

app.use(express.static("public"));
app.use(compression());

// Configure CORS
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
const expressSession = session({
  secret: "mebe23",
  resave: false,
  store: store,
  saveUninitialized: false,
});

app.use(expressSession);
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 88;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const ioServer = new Server(server, {
  cors: corsOptions,
  // pingTimeout: 60000,
});

let mySession;
let ip;
app.use((req, res, next) => {
  mySession = req.session.name ? req.session.name : "guest";
  ip = req.session.ip && req.session.ip;
  next();
});

let userLogin = [];
const getCurrentTimestamp = () => new Date();
ioServer.on("connection", async (socket) => {
  if (mySession) {
    try {
      // Periksa waktu sekarang
      const currentTime = getCurrentTimestamp();

      // Ambil data pengguna
      const user = await Users.findOne({
        where: { name: mySession, online: "true" },
      });

      if (user && user.online) {
        // Hitung selisih waktu dari updatedAt ke waktu sekarang
        const updatedAtTimeDiff = currentTime - new Date(user.updatedAt);

        // Ubah status menjadi false jika updatedAt lebih dari 5 menit
        if (updatedAtTimeDiff > 5 * 60 * 1000) {
          await Users.update(
            { online: "false" },
            { where: { name: mySession } }
          );
        }
      }
    } catch (error) {
      console.error(error);
    }

    try {
      Users.update({ online: "true", ip: ip }, { where: { name: mySession } });
      ioServer.emit("statusberubah", new Date());
      userLogin.push(mySession);
      // console.log("User connected: " + mySession + ", IP: " + ip);
    } catch (error) {
      console.log(error);
    }
  }

  socket.on("disconnect", async () => {
    if (mySession) {
      try {
        Users.update({ online: false, ip: ip }, { where: { name: mySession } });
        ioServer.emit("statusberubah", new Date());
        userLogin = userLogin.filter((user) => user !== mySession);
        // console.log("User disconnected: " + mySession + ", IP: " + ip);
      } catch (error) {
        console.log(error);
      }
    }
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Menjadikan folder monev_pnbp sebagai folder publik
app.use(
  "/monev_pnbp",
  express.static(path.join(__dirname, "public/monev_pnbp"))
);
app.listen(5000, () => console.log("Server berjalan di port 5000"));

app.use("/", router);
export default ioServer;
app.use(errorHandler);

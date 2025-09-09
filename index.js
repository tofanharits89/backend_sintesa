import express from "express";
// import https from "https";
import http from "http";
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
const privateKey = fs.readFileSync("./ssl/localhost-key.pem", "utf8");
const certificate = fs.readFileSync("./ssl/localhost.pem", "utf8");

const credentials = {
  key: privateKey,
  cert: certificate,
  // ca: ca,
};

// Create HTTPS server
const server = http.createServer(credentials, app);
// const server = https.createServer(credentials, app);

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
    "http://localhost",
    "http://localhost:88",
    "http://localhost:7000",
    "http://localhost:81",
    "http://10.216.208.135",
    "http://localhost",
    "http://localhost:88",
    "https://localhost",
    "http://localhost:3000",
    "https://sintesa.kemenkeu.go.id",
    "http://10.191.7.164",
    "http://10.191.190.201",
    "http://10.100.243.155",
  ],
};
const HOST = "localhost";
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

server.listen(port, HOST, () => {
  // console.log(Server is running on port ${port});
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

export default ioServer;
app.use("/", router);
//app.use("/", routerNEXT);
app.use(errorHandler);

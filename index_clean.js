import express from "express";
import https from "https";
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

// Membuat HTTP server (untuk development)
const server = http.createServer(app);

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
  methods: ["POST", "GET", "DELETE", "PUT", "PATCH", "OPTIONS"],
  origin: function (origin, callback) {
    // Izinkan request tanpa origin (mobile apps, postman, dll)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://10.191.190.201:80",
      "http://10.191.190.201:81",
      "http://10.191.190.201",
      "http://localhost:80",
      "http://localhost:81", 
      "http://localhost:88",
      "http://localhost:3000",
      "http://localhost",
      // Tambahkan IP lain jika diperlukan
      "https://sintesa.kemenkeu.go.id",
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200, // untuk legacy browser support
};

app.use(cors(corsOptions));

// Middleware untuk debugging CORS
app.use((req, res, next) => {
  console.log(`📡 Request from origin: ${req.get('Origin') || 'No Origin'}`);
  console.log(`📡 Request method: ${req.method}`);
  console.log(`📡 Request URL: ${req.url}`);
  
  // Set header tambahan untuk CORS
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Router utama
app.use("", router);

// Endpoint khusus untuk testing CORS
app.get('/cekmode', (req, res) => {
  res.json({
    status: 'success',
    message: 'CORS working correctly',
    origin: req.get('Origin') || 'No Origin',
    method: req.method,
    timestamp: new Date().toISOString(),
    serverIP: req.socket.localAddress,
    clientIP: req.ip || req.connection.remoteAddress
  });
});

app.get('/test-cors', (req, res) => {
  res.json({
    cors: 'enabled',
    origin: req.get('Origin'),
    headers: req.headers,
    timestamp: new Date()
  });
});

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
  console.log(`🔌 New Socket.IO connection: ${socket.id}`);
  console.log(`🔌 Client address: ${socket.handshake.address}`);
  console.log(`🔌 Session name: ${mySession || 'No session'}`);
  console.log(`🔌 Total connected clients: ${ioServer.engine.clientsCount}`);
  
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
  
  socket.on("disconnect", async (reason) => {
    console.log(`❌ Socket.IO client disconnected: ${socket.id}, reason: ${reason}`);
    console.log(`❌ Remaining connected clients: ${ioServer.engine.clientsCount}`);
    
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

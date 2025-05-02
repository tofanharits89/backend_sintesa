import jwt from "jsonwebtoken";
import { decryptData } from "./Decrypt.js";
import ioServer from "../index.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    //  console.log(token);
    const decryptToken = authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(
      decryptData(decryptToken).replace(/"/g, ""),
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          next(err);
        } else {
          req.username = decoded.username;
          next();
        }
      }
    );
  } catch (error) {
    next(error);
  }
  //console.log(req.session.username); //berhasil
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Terjadi kesalahan pada server [" + err + "]");
};

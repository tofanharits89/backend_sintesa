import express from "express";
import { getRepliesByNotifikasiId, createReply } from "../controllers/replypesan_controller.js";
const router = express.Router();

// Ambil semua reply untuk notifikasi tertentu
router.get("/:id", getRepliesByNotifikasiId);

// Tambahkan balasan ke notifikasi tertentu
router.post("/:id", createReply);

export default router;

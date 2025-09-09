import express from "express";
import { getRepliesByNotifikasiId, createReply } from "../controllers/replypesan_controller.js";
import { verifySuperAdmin, verifyAuth, bearerErrorHandler } from "../middleware/BearerAuth.js";
import Notifikasi from "../models/notifikasi/notifikasiModel.js";

const router = express.Router();

// DEBUG: Get all notifications for debugging (remove in production)
router.get("/debug/all", verifyAuth, async (req, res) => {
  try {
    const notifications = await Notifikasi.findAll({
      limit: 20,
      order: [['id', 'DESC']]
    });
    
    res.json({
      success: true,
      data: notifications,
      count: notifications.length,
      message: "DEBUG: All recent notifications"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all replies for a notification (requires authentication)
router.get("/:notifikasiId", verifyAuth, getRepliesByNotifikasiId);

// Create a new reply (requires SuperAdmin role)
router.post("/:notifikasiId", verifySuperAdmin, createReply);

// Apply error handler for Bearer token errors
router.use(bearerErrorHandler);

export default router;

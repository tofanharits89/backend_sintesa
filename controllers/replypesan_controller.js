// controllers/replypesan_controller.js

import Notifikasi from "../models/notifikasi/notifikasiModel.js"; // Pastikan path model benar
import ioServer from "../index.js"; // Import ioServer untuk real-time notifications

// Ambil semua balasan untuk satu notifikasi utama
export const getRepliesByNotifikasiId = async (req, res) => {
  try {
    const { notifikasiId } = req.params;
    
    // Enhanced logging untuk debugging
    console.log(`=== BACKEND getRepliesByNotifikasiId DEBUG START ===`);
    console.log(`Request received for notifikasiId: ${notifikasiId}`);
    console.log(`User ${req.user?.username} (${req.user?.role}) accessing replies for notification ${notifikasiId}`);
    console.log(`notifikasiId type: ${typeof notifikasiId}, value: ${notifikasiId}`);
    
    // Validate notifikasiId
    if (!notifikasiId) {
      console.log("❌ Missing notifikasiId parameter");
      return res.status(400).json({
        success: false,
        error: "Missing notification ID parameter",
        code: "MISSING_NOTIFIKASI_ID"
      });
    }
      // Test database connection
    console.log("🔄 Testing database connection...");
    await Notifikasi.findOne({ limit: 1 });
    console.log("✅ Database connection successful");
    
    // Debug: Check all notifications in the database
    console.log("🔍 Checking all notifications in database...");
    const allNotifications = await Notifikasi.findAll({
      limit: 10,
      order: [['id', 'DESC']]
    });
    console.log(`Total recent notifications in DB: ${allNotifications.length}`);
    allNotifications.forEach(notif => {
      console.log(`- ID: ${notif.id}, parent_id: ${notif.parent_id}, dari: ${notif.dari}, judul: ${notif.judul}`);
    });
    
    // Check specifically for notifications with the requested parent_id
    console.log(`🔍 Looking for any notifications with parent_id = ${notifikasiId}`);
    const parentIdMatches = await Notifikasi.findAll({
      where: { parent_id: notifikasiId }
    });
    console.log(`Found ${parentIdMatches.length} notifications with parent_id = ${notifikasiId}`);
    parentIdMatches.forEach(notif => {
      console.log(`- Reply ID: ${notif.id}, dari: ${notif.dari}, isi: ${notif.isi.substring(0, 50)}...`);
    });
      console.log(`🔍 Searching for replies with parent_id: ${notifikasiId}`);
    const replies = await Notifikasi.findAll({
      where: { parent_id: notifikasiId },
      order: [['createdAt', 'ASC']]
    });
    
    console.log(`Found ${replies.length} replies for notification ${notifikasiId}`);
    console.log("Raw replies data from database:", JSON.stringify(replies, null, 2));
    
    // Also check if there are any notifications without parent_id (original notifications)
    const originalNotification = await Notifikasi.findOne({
      where: { id: notifikasiId }
    });
    console.log("Original notification:", JSON.stringify(originalNotification, null, 2));
    
    console.log(`=== BACKEND DEBUG END ===`);
    
    const responseData = {
      success: true,
      data: replies,
      count: replies.length,
      debug: {
        searchedParentId: notifikasiId,
        foundCount: replies.length,
        originalNotificationExists: !!originalNotification
      }
    };
    
    console.log("Sending response to frontend:", JSON.stringify(responseData, null, 2));
    
    res.json(responseData);
  } catch (error) {
    console.error("❌ ERROR in getRepliesByNotifikasiId:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      sql: error.sql || "No SQL query",
      original: error.original || "No original error"
    });
    res.status(500).json({ 
      success: false,
      error: error.message,
      code: "GET_REPLIES_ERROR"
    });
  }
};

// Buat balasan baru ke satu notifikasi (Hanya SuperAdmin)
export const createReply = async (req, res) => {
  console.log("=== BACKEND createReply DEBUG START ===");
  
  try {
    const { notifikasiId } = req.params;
    const { text,tujuan } = req.body;

    // Validasi role - hanya SuperAdmin yang bisa reply
    if (req.user.role !== "X") {
      return res.status(403).json({ 
        success: false,
        error: "Access denied. Only SuperAdmin can reply to messages",
        code: "INSUFFICIENT_PERMISSIONS",
        userRole: req.user.role
      });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ 
        success: false,
        error: "Reply text is required",
        code: "MISSING_TEXT"
      });
    }

    // Log untuk audit trail
    console.log(`SuperAdmin ${req.user.username} creating reply for notification ${notifikasiId}`);    // Pastikan field lain diisi default jika dibutuhkan oleh model
    const reply = await Notifikasi.create({
      parent_id: notifikasiId,
      isi: text.trim(),
      dari: req.user.username,     // Gunakan username dari token
      tujuan: tujuan,                  // Atur sesuai kebutuhan aplikasi
      tipe_notif: 'pesan',         // 'pesan' untuk reply
      judul: 'Balasan Pesan',      // Judul default, boleh diganti
      status: 'false',             // Default unread
      pinned: 'false',             // Default tidak dipinned
      tipe: 'biasa'                // Default, boleh disesuaikan
    });// Log sukses untuk audit trail
    console.log(`Reply created successfully by ${req.user.username} with ID: ${reply.id}`);

    // Log informasi client yang terhubung
    console.log(`📊 Current Socket.IO connections: ${ioServer.engine.clientsCount}`);
    
    // Emit real-time notification untuk reply baru ke semua client
    console.log(`📡 Broadcasting reply to all clients for notification ${notifikasiId}`);
    
    // Event umum untuk notifikasi baru
    ioServer.emit("new-notification", {
      type: "reply",
      message: "Balasan baru telah ditambahkan",
      data: reply,
      timestamp: new Date(),
      from: req.user.username,
      notifikasiId: notifikasiId
    });
    console.log(`📡 Sent 'new-notification' event to ${ioServer.engine.clientsCount} clients`);

    // Event khusus untuk refresh replies di dialog yang sedang terbuka
    ioServer.emit("refresh-replies", {
      notifikasiId: notifikasiId,
      newReply: reply,
      timestamp: new Date(),
      from: req.user.username
    });
    console.log(`📡 Sent 'refresh-replies' event to ${ioServer.engine.clientsCount} clients`);

    // Event khusus untuk notifikasi ID tertentu
    ioServer.emit(`notification-${notifikasiId}-updated`, {
      type: "new_reply",
      reply: reply,
      timestamp: new Date(),
      from: req.user.username
    });
    console.log(`📡 Sent 'notification-${notifikasiId}-updated' event to ${ioServer.engine.clientsCount} clients`);

    console.log(`📡 Broadcast completed for notification ${notifikasiId}`);

    res.status(201).json({
      success: true,
      message: "Reply created successfully",
      data: reply
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      code: "CREATE_REPLY_ERROR"
    });
  }
};

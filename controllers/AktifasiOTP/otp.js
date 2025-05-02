import Log_bot_Model from "../../models/Otp/log_bot.js";
import Otp_Models from "../../models/Otp/pending_pin.js";
import Users from "../../models/UserModel.js";

export const AktifOTP = async (req, res) => {
  try {
    const { otp, username, pin } = req.body;

    // Retrieve OTP record
    const otpRecord = await Otp_Models.findOne({
      where: {
        username,
        otp,
        status: "Waiting", // Assuming 'Waiting' is the status for unactivated OTPs
      },
    });

    // Check if the OTP record exists
    if (!otpRecord) {
      return res
        .status(404)
        .json({ success: false, error: "OTP tidak sesuai" });
    }

    // Validate OTP expiration (1 minute validity)
    const createdAt = new Date(otpRecord.updatedAt);
    const currentTime = new Date();
    const expirationTime = new Date(createdAt.getTime() + 1 * 60 * 1000); // Correct expiration time to 1 minute (1000ms = 1 second)

    if (currentTime > expirationTime) {
      return res.status(410).json({
        success: false,
        error: "Waktu OTP telah expired",
      });
    }

    // Cek apakah PIN sudah dipakai
    const otpRecordCek = await Otp_Models.findOne({
      where: {
        username,
        pin,
        status: "OK", // Assuming 'Waiting' is the status for unactivated OTPs
      },
    });

    // Check if the OTP record exists
    if (otpRecordCek) {
      return res
        .status(404)
        .json({ success: false, error: "gunakan PIN yang lain" });
    }
    // Update OTP status
    const [updatedRows] = await Otp_Models.update(
      { status: "OK" },
      {
        where: {
          username,
          otp,
          status: "Waiting", // Ensure we are only updating the correct OTP record
        },
      }
    );
    const ubahStatus = await Users.update(
      {
        verified: "TRUE",
      },
      {
        where: {
          username,
        },
      }
    );

    // Check if any rows were updated
    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ success: false, error: "OTP tidak sesuai" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating OTP:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const Simpan_LogBOT = async (req, res) => {
  try {
    const { user, status, menu } = req.body;
    await Log_bot_Model.create({
      user,
      status,
      menu,
    });

    await Log_bot_Model.destroy({
      where: {
        user: "yacob",
      },
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error simpan data:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

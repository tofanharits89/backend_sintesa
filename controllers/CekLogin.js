import Login_status from "../models/Login_status.js";

export const CekLogin = async (req, res) => {
  try {
    // Check if username and ip are defined in the session
    if (!req.session.username || !req.session.ip) {
      return res.status(400).json({ message: "Invalid session data" });
    }
    //  console.log("tes " + req.session.username);
    const status = await Login_status.findOne({
      attributes: ["username", "ip", "status", "createdAt"],
      where: {
        username: req.session.username,
        ip: req.session.ip,
      },
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    if (status) {
      res.json("true");
    } else {
      res.json("false");
    }
  } catch (error) {
    console.error(error);

    // Handle specific Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Tes2 = async (req, res, next) => {
  try {
    if (!req.session.name) {
      return res.status(400).json({ message: "Invalid session data" });
    } else {
      console.log(req.session.username);
    }
    next();
  } catch (error) {
    console.error(error);
  }
};

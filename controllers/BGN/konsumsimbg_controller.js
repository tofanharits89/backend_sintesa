import KonsumsiMbg from "../../models/mbg/konsumsi_mbg.js";

export const getAllKonsumsiMbg = async (req, res) => {
  try {
    const data = await KonsumsiMbg.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

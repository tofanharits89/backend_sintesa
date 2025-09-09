import EWSTrend2025 from "../../models/mbg/ews.js";

// Get all EWS Trend data
export const getAllEWS = async (req, res) => {
  try {
    const data = await EWSTrend2025.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get EWS Trend by id
export const getEWSById = async (req, res) => {
  try {
    const data = await EWSTrend2025.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Data not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

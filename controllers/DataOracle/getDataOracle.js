import oracle_db from "../../config/Oracle.js";

export const getDataOracle = async (req, res, next) => {
  try {
    const connection = await oracle_db();
    const result = await connection.execute(
      "select synonym_name from user_synonyms order by table_name asc"
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getTableOracle = async (req, res, next) => {
  try {
    const { selectedDatabase } = req.params;

    // Memeriksa jika selectedDatabase kosong atau tidak terdefinisi
    if (!selectedDatabase || selectedDatabase.trim() === "") {
      return res.status(400).json({ error: "Parameter tidak boleh kosong" });
    }

    const connection = await oracle_db(); // Assuming oracle_db() establishes the Oracle connection
    connection.on("error", async (error) => {
      if (error.message.includes("ORA-12170")) {
        // Handle the timeout error
        console.error("Timeout occurred:", error);
        return res.status(500).json({ error: "TNS:Connect timeout occurred" });
      } else {
        console.error("Error:", error);
        next(error);
      }
    });

    const result = await connection.execute(
      `${selectedDatabase} WHERE ROWNUM <= 50000`
    );

    const combinedData = result.rows.map((row) => {
      const formattedRow = {};
      row.forEach((value, index) => {
        formattedRow[result.metaData[index].name] = value;
      });
      return formattedRow;
    });

    res.json({ rows: combinedData });
  } catch (error) {
    next(error);
  }
};

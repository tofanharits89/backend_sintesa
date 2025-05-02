import oracledb from "oracledb";

async function oracle_db() {
  try {
    await oracledb.initOracleClient({
      libDir: "C:\\oracle\\instantclient_19_21",
    });

    // Menghubungkan ke database
    console.log("Menghubungkan ke database...");
    const connection = await oracledb.getConnection({
      user: "USRPA",
      password: "pdpsipa",
      connectString: "10.216.238.145:1521/olap23",
    });
    console.log("Koneksi berhasil.");

    return connection;
  } catch (error) {
    console.error("Terjadi kesalahan saat menghubungkan ke database ORACLE");
  }
}

export default oracle_db;

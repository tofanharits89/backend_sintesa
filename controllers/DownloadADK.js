import fs from "fs";
import path from "path";

// Fungsi untuk menangani permintaan download
export const downloadADK = (req, res) => {
  const { tahun, folder, nmfile } = req.query;

  let file;
  switch (tahun) {
    case "2013":
      file = `\\\\10.216.208.137\\kumpulan_adk\\ADK 2013 DIPA\\${folder.substr(
        0,
        2
      )}\\${folder.substr(3, 3)}\\${nmfile}`;
      break;
    case "2014":
      file = `\\\\10.216.208.137\\kumpulan_adk\\ADK 2014 DIPA\\${folder.substr(
        0,
        2
      )}\\${folder.substr(3, 3)}\\${nmfile}`;
      break;
    case "2015":
      file = `\\\\10.216.208.137\\kumpulan_adk\\ADK 2015 DIPA\\${folder.substr(
        0,
        2
      )}\\${folder.substr(3, 3)}\\${nmfile}`;
      break;
    case "2016":
      file = `\\\\10.216.208.137\\kumpulan_adk\\ADK 2016 DIPA\\${folder.substr(
        0,
        2
      )}\\${folder.substr(3, 3)}\\${nmfile}`;
      break;
    case "2017":
      file = `\\\\10.216.208.137\\kumpulan_adk\\ADK 2017 DIPA\\${folder.substr(
        0,
        2
      )}\\${folder.substr(3, 3)}\\${nmfile}`;
      break;
    case "2018":
      file = `\\\\10.216.208.137\\kumpulan_adk\\ADK 2018 DIPA\\${folder.substr(
        0,
        2
      )}\\${folder.substr(3, 3)}\\${nmfile}`;
      break;
    case "2019":
      file = `\\\\10.216.208.137\\kumpulan_adk\\ADK_2019_DIPA\\${folder.substr(
        0,
        2
      )}\\${folder.substr(3, 3)}\\${nmfile}`;
      break;
    case "2020":
      file = `\\\\10.216.208.137\\kumpulan_adk\\ADK_2020_DIPA\\${folder.substr(
        0,
        2
      )}\\${folder.substr(3, 3)}\\${nmfile}`;
      break;
    case "2021":
      file = `\\\\10.216.208.137\\kumpulan_adk\\ADK_2021_DIPA\\${folder.substr(
        0,
        2
      )}\\${folder.substr(3, 3)}\\${nmfile}`;
      break;
    case "2022":
      file = `\\\\10.216.208.137\\kumpulan_adk\\ADK_2022_DIPA\\${folder.substr(
        0,
        2
      )}\\${folder.substr(3, 3)}\\${nmfile}`;
      break;
    case "2023":
      file = `\\\\10.216.208.137\\kumpulan_adk\\ADK_2023_DIPA\\${folder.substr(
        0,
        3
      )}\\${folder.substr(4, 2)}\\${nmfile}`;
      break;
    case "2024":
      file = `\\\\10.216.208.137\\kumpulan_adk\\ADK_2024_DIPA\\${folder.substr(
        0,
        2
      )}\\${folder.substr(3, 3)}\\${nmfile}`;
      break;
    case "2025":
      file = `\\\\10.216.208.137\\kumpulan_adk\\ADK_2025_DIPA\\${folder.substr(
        0,
        2
      )}\\${folder.substr(3, 3)}\\${nmfile}`;
      break;
    default:
      return res.status(400).send("Invalid year");
  }

  console.log(`Attempting to read file at path: ${file}`);

  // Baca file dari SMB share
  fs.readFile(file, (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Failed to read file from SMB share.");
    }

    const fileExt = path.extname(nmfile).toLowerCase();
    const fileName = path.basename(nmfile);
    // Atur Content-Type berdasarkan ekstensi file
    let contentType = "application/octet-stream"; // Default content type
    switch (fileExt) {
      case ".pdf":
        contentType = "application/pdf";
        break;
      case ".txt":
        contentType = "text/plain";
        break;
      default:
        contentType = "application/octet-stream";
        break;
    }

    // Kirim file sebagai respons ke client
    res.set({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`, // Atur nama file untuk diunduh
    });
    res.send(data); // Kirim data file ke client
  });
};

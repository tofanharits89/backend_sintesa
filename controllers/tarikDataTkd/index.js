const { tarik_dd_header } = require("./dd_header.js");
const { tarik_dd_header_detail } = require("./dd_header_detail.js");
const { tarik_dd_pagu } = require("./dd_pagu.js");
const { tarik_summaryTahap } = require("./summary_dd.js");
const { tarik_tSalur } = require("./t_salur.js");
const { tarik_tSerap } = require("./t_serap.js");

async function measureExecutionTime(fn, label, io) {
  const startTime = Date.now();
  await fn(io); // Panggil fungsi dengan parameter io
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000; // Convert to seconds
  console.log(`${label} selesai dalam waktu ${duration.toFixed(2)} detik.`);
  return duration;
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${hours} jam, ${minutes} menit, ${remainingSeconds} detik`;
}

async function updateTkd(io) {
  let totalDuration = 0;

  try {
    totalDuration += await measureExecutionTime(
      tarik_dd_pagu,
      "Ambil Data Pagu DD",
      io
    );
    console.log(
      `--------------------------------------------------------------`
    );
    totalDuration += await measureExecutionTime(
      tarik_dd_header,
      "Tarik Data Header DD",
      io
    );
    console.log(
      `--------------------------------------------------------------`
    );
    totalDuration += await measureExecutionTime(
      tarik_dd_header_detail,
      "Tarik Data Header Detail DD",
      io
    );
    console.log(
      `--------------------------------------------------------------`
    );
    totalDuration += await measureExecutionTime(
      tarik_tSalur,
      "Data Penyaluran DD",
      io
    );
    console.log(
      `--------------------------------------------------------------`
    );
    totalDuration += await measureExecutionTime(
      tarik_tSerap,
      "Data Penyerapan DD",
      io
    );
    console.log(
      `--------------------------------------------------------------`
    );
    totalDuration += await measureExecutionTime(
      tarik_summaryTahap,
      "Data Summary DD",
      io
    );
    console.log(
      `--------------------------------------------------------------`
    );

    console.log(
      `Total waktu untuk semua proses: ${formatDuration(totalDuration)}.\n`
    );
    console.log(
      `--------------------------------------------------------------`
    );
  } catch (error) {
    console.error("Terjadi kesalahan:", error.message);
  }
}
module.exports = { updateTkd };


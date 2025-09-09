import Encrypt from "./test.js";

// Coba dengan query sederhana untuk testing
const q = `SELECT kdunit, nmunit FROM pagu_real_utama LIMIT 5`;
const encrypted = Encrypt(q);
console.log(encodeURIComponent(encrypted));

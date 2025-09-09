import DataBPS from "../../models/mbg/DataBPS.js";
import DataBapanas from "../../models/mbg/DataBapanas.js";
import DataTriwulanan from "../../models/mbg/DataTriwulanan.js";
import Permasalahan from "../../models/mbg/permasalahan.js";
import KesimpulanSaran from "../../models/mbg/kesimpulan_saran.js";

// GET ALL DATA UNTUK TABEL PERKEMBANGAN (gabungan dari beberapa tabel)
export const getPerkembanganKanwil = async (req, res) => {
  try {
    const { tahun, triwulan, kode_kanwil } = req.query;
    
    console.log('Query params:', { tahun, triwulan, kode_kanwil }); // Debug log
    
    // Jika kode_kanwil adalah 'ALL' atau kosong, ambil data untuk semua kanwil
    const whereCondition = {};
    if (tahun) whereCondition.tahun = tahun;
    if (triwulan) whereCondition.triwulan = triwulan;
    if (kode_kanwil && kode_kanwil !== 'ALL' && kode_kanwil !== '') {
      whereCondition.kode_kanwil = kode_kanwil;
    }
    
    console.log('Where condition:', whereCondition);
    
    // Ambil data dari masing-masing tabel
    const [makrokesraList, harga_komoditasList, lainnyaList, permasalahanList, kesimpulanSaranList] = await Promise.all([
      DataBPS.findAll({ where: whereCondition }),
      DataBapanas.findAll({ where: whereCondition }),
      DataTriwulanan.findAll({ where: whereCondition }),
      Permasalahan.findAll({ where: whereCondition }),
      KesimpulanSaran.findAll({ where: whereCondition })
    ]);

    // Debug log untuk melihat hasil query
    console.log('Query results count:', {
      makrokesra: makrokesraList.length,
      harga_komoditas: harga_komoditasList.length,
      lainnya: lainnyaList.length,
      permasalahan: permasalahanList.length,
      kesimpulanSaran: kesimpulanSaranList.length
    });
    
    // Gabungkan data berdasarkan kode_kanwil dan triwulan
    const dataMap = new Map();
    
    // Helper function untuk menambah data ke map
    const addToMap = (list, field) => {
      list.forEach(item => {
        const key = `${item.kode_kanwil}_${item.triwulan}`;
        if (!dataMap.has(key)) {
          dataMap.set(key, {
            Kanwil: item.kode_kanwil,
            triwulan: item.triwulan,
            tahun: item.tahun,
            perkembangan_makrokesra: "",
            perkembangan_harga_komoditas: "",
            perkembangan_lainnya: "",
            permasalahan_isu: "",
            kesimpulan: "",
            rekomendasi: ""
          });
        }
        const existing = dataMap.get(key);
        if (field === 'makrokesra') existing.perkembangan_makrokesra = item.keterangan || "";
        if (field === 'harga_komoditas') existing.perkembangan_harga_komoditas = item.keterangan || "";
        if (field === 'lainnya') existing.perkembangan_lainnya = item.keterangan || "";
        if (field === 'permasalahan') existing.permasalahan_isu = item.keterangan || "";
        if (field === 'kesimpulan') {
          existing.kesimpulan = item.kesimpulan || "";
          existing.rekomendasi = item.saran || "";
        }
      });
    };
    
    // Gabungkan semua data
    addToMap(makrokesraList, 'makrokesra');
    addToMap(harga_komoditasList, 'harga_komoditas');
    addToMap(lainnyaList, 'lainnya');
    addToMap(permasalahanList, 'permasalahan');
    addToMap(kesimpulanSaranList, 'kesimpulan');
    
    // Convert map to array
    const results = Array.from(dataMap.values());
    
    console.log('Final results count:', results.length);
    
    // Jika tidak ada data sama sekali, buat dummy row untuk menunjukkan struktur
    if (results.length === 0) {
      console.log('No data found, creating empty structure...');
      
      // Jika meminta data spesifik kanwil, buat 1 row kosong
      if (kode_kanwil && kode_kanwil !== 'ALL' && kode_kanwil !== '') {
        results.push({
          Kanwil: kode_kanwil,
          triwulan: triwulan || 'I',
          tahun: tahun || '2024',
          perkembangan_makrokesra: "",
          perkembangan_harga_komoditas: "",
          perkembangan_lainnya: "",
          permasalahan_isu: "",
          kesimpulan: "",
          rekomendasi: ""
        });
      } else {
        // Jika ALL kanwil, buat beberapa row sample untuk kanwil utama
        const sampleKanwils = ['01', '11', '12', '15', '33'];
        sampleKanwils.forEach(kode => {
          results.push({
            Kanwil: kode,
            triwulan: triwulan || 'I',
            tahun: tahun || '2024',
            perkembangan_makrokesra: "",
            perkembangan_harga_komoditas: "",
            perkembangan_lainnya: "",
            permasalahan_isu: "",
            kesimpulan: "",
            rekomendasi: ""
          });
        });
      }
    }
    
    res.json({
      message: "Data perkembangan berhasil diambil",
      data: results
    });
  } catch (err) {
    console.error('Error in getPerkembanganKanwil:', err);
    res.status(500).json({ error: err.message });
  }
};

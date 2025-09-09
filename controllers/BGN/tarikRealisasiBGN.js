import db from "../../config/Database9.js";

export const getRealisasiBGN = async (req, res) => {
  const { tglAwal, tglAkhir } = req.query;
  try {
    const [results] = await db.query(
      `SELECT a.kddept,b.nmdept,a.kdunit,c.nmunit,q.kdfungsi,r.nmfungsi,q.kdsfung,s.nmsfung,a.kdprogram,l.nmprogram,a.kdgiat,m.nmgiat,a.kdoutput,n.nmoutput,a.kdsoutput,aa.ursoutput,a.kdakun, p.nmakun,a.tglsp2d, SUM(realisasi) realisasi 
      FROM monev2025.a_realisasi_bgn_2025 a 
      LEFT JOIN dbref.t_dept_2025 b ON a.kddept=b.kddept 
      LEFT JOIN dbref.t_unit_2025 c ON a.kddept=c.kddept AND a.kdunit=c.kdunit 
      LEFT JOIN dbref.t_program_2025 l ON a.kddept = l.kddept AND a.kdunit = l.kdunit AND a.kdprogram =l.kdprogram 
      LEFT JOIN dbref.t_giat_2025 m ON a.kddept = m.kddept AND a.kdunit = m.kdunit AND a.kdprogram =m.kdprogram AND a.kdgiat =m.kdgiat 
      LEFT JOIN dbref.t_output_2025 n ON  a.kddept = n.kddept AND a.kdunit = n.kdunit AND a.kdprogram =n.kdprogram AND a.kdgiat=n.kdgiat AND a.kdoutput = n.kdoutput 
      LEFT JOIN dbref.dipa_soutput_25 aa ON a.kdsatker=aa.kdsatker AND a.kddept=aa.kddept AND a.kdunit=aa.kdunit AND a.kdprogram=aa.kdprogram AND a.kdgiat=aa.kdgiat AND a.kdoutput=aa.kdoutput AND a.kdsoutput=aa.kdsoutput 
      LEFT JOIN dbref.t_akun_2025 p ON a.kdakun=p.kdakun 
      LEFT JOIN dbref.t_giat_2025 q ON a.kddept=q.kddept AND a.kdunit=q.kdunit AND a.kdprogram=q.kdprogram AND a.kdgiat=q.kdgiat
      LEFT JOIN dbref.t_fungsi_2025 r ON q.kdfungsi=r.kdfungsi 
      LEFT JOIN dbref.t_sfung_2025 s ON q.kdfungsi=s.kdfungsi AND q.kdsfung=s.kdsfung 
      WHERE a.tglsp2d >= ? AND a.tglsp2d <= ?
      GROUP BY a.kddept,a.kdunit,q.kdfungsi,q.kdsfung,a.kdprogram,a.kdgiat,a.kdoutput,a.kdsoutput,a.kdakun,a.tglsp2d
      ORDER BY a.tglsp2d DESC`,
      { replacements: [tglAwal, tglAkhir] }
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

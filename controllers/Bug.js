import multer from "multer";
import path from "path";

// Konfigurasi penyimpanan untuk file gambar yang diunggah
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/bug/'); // Direktori penyimpanan file gambar
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(null, new Date().toISOString().replace(/:/g, '-') + extname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') &&
        /\.(jpg|jpeg|png|gif)$/.test(path.extname(file.originalname).toLowerCase()) &&
        file.size <= 1024 * 1024) { // Ukuran file maksimum (dalam byte)
        cb(null, true);
    } else {
        cb(new Error('File gambar tidak valid.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});
// Controller untuk menangani unggahan file gambar
export const uploadImage = (req, res) => {
    upload.single('./public/bug')(req, res, (err) => {
        if (err) {
            console.log(err);
            // return res.status(400).json({ message: err.message });

        }

        if (!req.file) {
            return res.status(400).json({ message: 'File gambar tidak valid.' });
        }

        // Lakukan sesuatu dengan file gambar yang diunggah (req.file)
        // Anda dapat menyimpan informasi tentang file ini di database atau melakukan tindakan lain yang sesuai.

        return res.status(200).json({ message: 'File gambar berhasil diunggah.' });
    });
};


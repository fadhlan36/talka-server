import multer from 'multer';
import path from 'path';
import fs from 'fs';

// lokasi folder upload
const uploadDir = path.join(
    process.cwd(),
    'dist',
    'src',
    'public'
);

// buat folder jika belum ada
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueSuffix =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueSuffix +
            path.extname(file.originalname)
        );
    }
});

// filter hanya gambar
const fileFilter = (
    req: any,
    file: any,
    cb: any
) => {

    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(
            new Error(
                'Hanya file gambar!'
            ),
            false
        );
    }

};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
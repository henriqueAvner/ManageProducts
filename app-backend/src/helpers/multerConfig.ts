import multer from 'multer';
import path from 'path';
export const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, path.resolve('uploads'));
    },
    filename: (_req, file, callback) => {
        const time = new Date().getTime();
        callback(null, `${time}_${file.originalname}`);
    }
});
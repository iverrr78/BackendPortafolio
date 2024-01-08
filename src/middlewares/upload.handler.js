import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/images'));
  },
  filename: function (req, file, cb) {
    const uniqueFileName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueFileName);
  }
});

const upload = multer({ storage: storage });

export {upload};
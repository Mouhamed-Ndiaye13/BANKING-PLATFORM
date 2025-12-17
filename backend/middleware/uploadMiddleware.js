
import multer from "multer";
import fs from "fs";
import path from "path";

// Chemin du dossier avatars
const avatarsDir = path.join(process.cwd(), "uploads/avatars");

// Crée le dossier s'il n'existe pas
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
  console.log("Dossier uploads/avatars créé !");
}

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;

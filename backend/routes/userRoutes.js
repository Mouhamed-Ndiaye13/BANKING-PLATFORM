const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const upload = require("../middleware/uploadMiddleware");

//  Créer un utilisateur (POST /api/users)
router.post("/", userController.createUser);

// Modifier profil (PUT /api/users/update-profile)
router.put("/update-profile", auth, userController.updateProfile);

// Modifier mot de passe (PUT /api/users/update-password)
router.put("/update-password", auth, userController.updatePassword);

// Ajouter image (POST /api/users/upload-photo)
router.post("/upload-photo", auth, upload.single("photo"), userController.updateAvatar);

module.exports = router;

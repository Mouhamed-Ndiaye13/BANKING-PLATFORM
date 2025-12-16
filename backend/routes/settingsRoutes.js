import express from "express";
import { getProfile, updateProfile, changePassword, updateAvatar } from "../controllers/settingsController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// GET /me => renvoie le profil complet
router.get("/me", auth, getProfile);

// Mettre à jour le profil
router.put("/update-profile", auth, updateProfile);

// Changer le mot de passe
router.put("/change-password", auth, changePassword);

// Mettre à jour l’avatar
router.put("/update-avatar", auth, upload.single("avatar"), updateAvatar);

export default router;

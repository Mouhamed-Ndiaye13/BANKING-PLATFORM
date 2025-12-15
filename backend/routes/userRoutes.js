
import express from "express";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  list,
  get,
  update,
  removeAdmin,
  createUser,
  updateProfile,
  updatePassword,
  updateAvatar, 
} from "../controllers/userController.js";

const router = express.Router();

// ----- Admin gestion -----
router.get("/", auth, isAdmin, list);               // Liste tous les utilisateurs
router.get("/:id", auth, isAdmin, get);            // Récupérer un utilisateur par id
router.post("/", auth, isAdmin, createUser);       // Créer un utilisateur (admin)
router.put("/:id", auth, isAdmin, update);         // Modifier un utilisateur (admin)
router.delete("/:id", auth, isAdmin, removeAdmin); // Supprimer un utilisateur (admin)

// ----- User gestion -----
router.put("/update-profile", auth, updateProfile);           // Modifier profil
router.put("/update-password", auth, updatePassword);         // Modifier mot de passe
router.post("/upload-photo", auth, upload.single("photo"), updateAvatar); // Ajouter avatar

export default router;

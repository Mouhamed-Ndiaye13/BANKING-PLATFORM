
import express from "express";
import {
  register,confirmEmail,
  login,
  verifyEmail2FA,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Inscription
router.post("/register", register);

router.get("/confirm-email/:token", confirmEmail);
// Login (peut déclencher 2FA)
router.post("/login", login);

// Vérification code 2FA email
router.post("/verify-email-2fa", verifyEmail2FA);

// Mot de passe oublié
router.post("/forgot-password", forgotPassword);

// Réinitialisation mot de passe
router.post("/reset-password/:token", resetPassword);

// Exemple route protégée (nécessite JWT)
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.id}, tu es authentifié !` });
});

export default router;

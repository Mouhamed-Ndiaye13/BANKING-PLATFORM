import express from "express";
import {
  register,
  login,
  checkEmail,
  confirmEmail,
  verifyEmail2FA,
  toggleTwoFA,
  forgotPassword,
  resetPassword,
  loginWithGoogle
} from "../controllers/authController.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

// Inscription
router.post("/register", register);

// Vérifier si email existe (frontend)
router.get("/check-email", checkEmail);

// Login classique
router.post("/login", login);

// Login Google
router.post("/login/google", loginWithGoogle);

// Vérification code 2FA email
router.post("/verify-email-2fa", verifyEmail2FA);

// Activer/désactiver 2FA
router.put("/settings/two-factor", Auth, toggleTwoFA);

// Mot de passe oublié
router.post("/forgot-password", forgotPassword);

// Réinitialisation mot de passe
router.post("/reset-password/:token", resetPassword);

// Confirmer email
router.get("/confirm-email/:token", confirmEmail);

// Exemple route protégée
router.get("/protected", Auth, (req, res) => {
  res.json({ message: `Hello ${req.user.id}, tu es authentifié !` });
});

export default router;

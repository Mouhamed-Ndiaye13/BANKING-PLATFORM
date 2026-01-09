import express from "express"
import {
  register,confirmEmail,
  login,
  verifyEmail2FA,
  toggleTwoFA ,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";
import Auth from "../middleware/auth.js";


const router = express.Router();

// Inscription
router.post("/register", register);

// Vérifier email avant inscription
router.get("/check-email", checkEmail);

router.get("/confirm-email/:token", confirmEmail);
// Login (peut déclencher 2FA)
router.post("/login", login);

// Vérification code 2FA email
router.post("/verify-email-2fa", verifyEmail2FA);

router.put("/settings/two-factor", Auth, toggleTwoFA);
// Mot de passe oublié
router.post("/forgot-password", forgotPassword);

// Réinitialisation mot de passe
router.post("/reset-password/:token", resetPassword);

// Exemple route protégée (nécessite JWT)
router.get("/protected", Auth, (req, res) => {
  res.json({ message: `Hello ${req.user.id}, tu es authentifié !` });
});


export default router;

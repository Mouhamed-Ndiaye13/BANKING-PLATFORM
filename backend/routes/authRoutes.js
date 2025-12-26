import express from "express"
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

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Erreur de validation
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Identifiants invalides
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Demander réinitialisation mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email envoyé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Réinitialiser le mot de passe
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token reçu par email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 *       400:
 *         description: Token invalide ou expiré
 */
router.post("/reset-password/:token", resetPassword);

export default router;

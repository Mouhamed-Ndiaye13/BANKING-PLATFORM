import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Route pour démarrer l'authentification Google
router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Callback Google
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    try {
      // Générer JWT compatible avec ton système existant
      const token = jwt.sign(
        {
          userId: req.user._id,
          email: req.user.email,
          name: req.user.name,
          provider: "google",
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      // Rediriger vers le frontend
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const redirectUrl = `${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify({
          id: req.user._id,
          email: req.user.email,
          name: req.user.name,
          prenom: req.user.prenom,
          avatar: req.user.avatar,
          isGoogleUser: req.user.isGoogleUser,
        })
      )}`;

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("❌ Erreur Google Callback:", error);
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=google_auth_failed`);
    }
  }
);

// Vérifier la configuration Google
router.get("/config", (req, res) => {
  res.json({
    success: true,
    googleEnabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    clientId: process.env.GOOGLE_CLIENT_ID ? "configured" : "not_configured",
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  });
});

export default router;
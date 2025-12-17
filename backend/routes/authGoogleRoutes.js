import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();


//  Démarrer Google Auth

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
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  (req, res) => {
    try {
      if (!req.user) return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);

      // Générer JWT
      const token = jwt.sign(
        {
          id: req.user._id,
          email: req.user.email,
          name: req.user.name,
          provider: "google",
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Redirection vers frontend avec token et user
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify({
          id: req.user._id,
          email: req.user.email,
          name: req.user.name,
          avatar: req.user.avatar,
        })
      )}`;

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  }
);

// Config Google

router.get("/config", (req, res) => {
  res.json({
    success: true,
    googleEnabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    url: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/google`,
  });
});

export default router;

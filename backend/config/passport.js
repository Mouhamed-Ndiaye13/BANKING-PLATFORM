import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

// Configuration Google Strategy
const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log("🔐 Google Profile:", profile.id);
          
          // Utiliser la méthode statique du modèle User
          const user = await User.findOrCreateGoogleUser({
            ...profile._json,
            accessToken,
          });
          
          return done(null, user);
        } catch (error) {
          console.error("❌ Erreur Google Auth:", error);
          return done(error, null);
        }
      }
    )
  );

  // Sérialisation utilisateur
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Désérialisation utilisateur
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  return passport;
};

export default configurePassport;
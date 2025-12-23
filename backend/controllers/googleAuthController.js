import admin from "../config/firebaseAdmin.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Token Firebase manquant" });
  }

  try {
    // Vérification du token Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const {
      email,
      name,
      uid,
      picture,
    } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: "Email non trouvé dans le token" });
    }

    // Recherche utilisateur
    let user = await User.findOne({ email });

    // Création si inexistant
    if (!user) {
      user = await User.create({
        email,
        name: name || email.split("@")[0],
        firebaseUid: uid,
        avatar: picture,
        password: null,
      });
    }

    // Génération du JWT backend
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    return res.status(200).json({
      message: "Connexion Google réussie",
      token,
      user,
    });

  } catch (error) {
    console.error("Erreur Google Login backend :", error);
    return res.status(401).json({
      message: "Token Firebase invalide ou expiré",
    });
  }
};

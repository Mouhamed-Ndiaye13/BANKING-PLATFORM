import admin from "../config/firebaseAdmin.js";
import User from "../models/User.js"; // ton modèle utilisateur
import jwt from "jsonwebtoken";

export const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Token manquant" });
  } 

  try {
    // Vérifie le token Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, uid, picture } = decodedToken;

    // Cherche l'utilisateur dans la base
    let user = await User.findOne({ email });

    // Si l'utilisateur n'existe pas, on le crée
    if (!user) {
      user = new User({
        email,
        name: name || email.split("@")[0],
        firebaseUid: uid,
        avatar: picture,
        password: null, // Pas de mot de passe pour Google login
      });
      await user.save();
    }

    // Crée un JWT pour ton front
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Erreur Google Login backend :", err);
    res.status(500).json({ message: "Erreur serveur lors de la connexion Google" });
  }
};

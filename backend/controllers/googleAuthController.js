import admin from "../config/firebaseAdmin.js";
import User from "../models/User.js"; // ton modèle utilisateur MongoDB

export const verifyGoogleToken = async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ message: "Token manquant" });

  try {
    // Vérifie le token Firebase envoyé depuis le front
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    // Cherche ou crée l'utilisateur dans MongoDB
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, avatar: picture });
    }

    res.status(200).json({ message: "Utilisateur connecté", user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token Google invalide" });
  }
};

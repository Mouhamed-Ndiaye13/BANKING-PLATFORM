// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Non autorisé" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: "Utilisateur non trouvé" });

    req.user = user; // ID et infos dispo dans req.user
    next();
  } catch (err) {
    res.status(401).json({ error: "Token invalide" });
  }
};

// ✅ Export par défaut pour ESM
export default auth;

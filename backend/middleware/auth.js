/// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Récupérer l'utilisateur complet
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = { id: user._id };
 //  user réel (name, email, avatar)
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

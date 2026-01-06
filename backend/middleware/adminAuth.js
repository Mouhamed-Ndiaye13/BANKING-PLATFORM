import jwt from "jsonwebtoken";

export default function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token manquant" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET); // <-- changer ici
    req.user = decoded; // id + role
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}

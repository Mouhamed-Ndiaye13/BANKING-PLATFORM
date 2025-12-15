import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token reçu :", token); // Pour debug

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token invalide" });
  }
};

// const jwt = require('jsonwebtoken');

// exports.verifyAdmin = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Token manquant" });

//   try {
//     const decoded = jwt.verify(token, "SECRET_KEY");
//     if (decoded.role !== "admin") return res.status(403).json({ message: "Accès refusé" });
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(401).json({ message: "Token invalide" });
//   }
// };



import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

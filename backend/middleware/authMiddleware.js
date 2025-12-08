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

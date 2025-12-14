import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";

// Routes import
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

// NOUVELLE ROUTE - Google Auth
import authGoogleRoutes from "./routes/authGoogleRoutes.js"; // <-- NOUVEAU

// NOUVELLE CONFIG - Passport
import configurePassport from "./config/passport.js"; // <-- NOUVEAU

dotenv.config();

const app = express();

// Configuration CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Session (pour Google Auth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "rewmi-bank-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24h
    },
  })
);

// Initialiser et configurer Passport
const passportInstance = configurePassport();
app.use(passportInstance.initialize());
app.use(passportInstance.session());

// Routes principales (EXISTANTES - NE PAS MODIFIER)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);

// NOUVELLE ROUTE - Google Auth (AJOUTÉE)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  app.use("/api/auth/google", authGoogleRoutes);
  console.log("✅ Authentification Google activée");
}

// Route de santé
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    googleAuth: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  });
});

// Test (EXISTANT)
app.get("/", (req, res) => res.send("Backend Banque Rewmi ✔"));

// MongoDB (EXISTANT)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté ✔"))
  .catch((err) => console.error("Erreur MongoDB :", err));

// Start serveur (EXISTANT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✔ Backend running on port ${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  console.log(`🔐 Google Auth: ${process.env.GOOGLE_CLIENT_ID ? "✅ Activé" : "❌ Désactivé"}`);
});
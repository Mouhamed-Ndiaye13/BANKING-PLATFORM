import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import path from "path";

import "./config/firebaseAdmin.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import carteRoutes from "./routes/carteRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import beneficiaireRoutes from "./routes/beneficiaireRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();
const app = express();

// ==================
// CORS (WEB + MOBILE)
// ==================
const allowedOrigins = [
  "http://localhost:3000",                   // Frontend local
  "https://tache-21-frontt.vercel.app",     // Frontend Render / Vercel
];

app.use(cors({
  origin: (origin, callback) => {
    // Postman / React Native (pas d'origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn("CORS blocked:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Middleware pour capturer les erreurs CORS et renvoyer un JSON
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: err.message });
  }
  next(err);
});

// ==================
// Middleware
// ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================
// Session (Google Auth seulement)
// ==================
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// ==================
// Static uploads
// ==================
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ==================
// Routes API
// ==================
app.use("/api/auth", authRoutes);
app.use("/api/auth/google", googleAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cards", carteRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/transfer", transferRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/beneficiaires", beneficiaireRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contacts", contactRoutes);

// Admin
app.use("/admin", adminRoutes);

// ==================
// Health check
// ==================
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend Banque Rewmi running 🚀",
  });
});

// ==================
// MongoDB
// ==================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connecté ✔"))
.catch(err => console.error("MongoDB error :", err));

// ==================
// Start server
// ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

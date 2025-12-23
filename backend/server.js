import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Routes import
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js"; 
import supportRoutes from './routes/supportRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import paymentRoutes from "./routes/paymentRoutes.js"; 
import notificationRoutes from "./routes/notificationRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import beneficiaireRoutes from "./routes/beneficiaireRoutes.js";

// Firebase Admin
import admin from "./config/firebaseAdmin.js";

dotenv.config();
const app = express();

// CORS
const allowedOrigins = process.env.FRONTEND_URLS?.split(",") || [];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes principales
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/beneficiaires", beneficiaireRoutes);

// Google Auth routes
app.use("/api/auth", googleAuthRoutes);


// Test endpoint
app.get("/", (req, res) => res.send("Backend Banque Rewmi"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur MongoDB :", err));

// Start serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  console.log("Google Auth: Activé (Firebase)");
});

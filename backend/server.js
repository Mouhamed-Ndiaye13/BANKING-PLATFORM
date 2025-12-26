import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import path from "path";

import  admin from "./config/firebaseAdmin.js";


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

dotenv.config();
const app = express();

// ==================
// CORS
// ==================
const allowedOrigins = process.env.FRONTEND_URLS?.split(",") || [];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(
cors({
origin: (origin, callback) => {
// Autorise Postman, mobile, etc.
if (!origin) return callback(null, true);

if (allowedOrigins.includes(origin)) {  
    return callback(null, true);  
  } else {  
    return callback(new Error("Not allowed by CORS"));  
  }  
},  
credentials: true,  
methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],  
allowedHeaders: ["Content-Type", "Authorization"],

})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================
// Session (pour Google Auth)
// ==================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// ==================
// Static uploads
// ==================
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ==================
// Routes principales
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


app.get("/", (req, res) => res.send("Backend Banque Rewmi"));

// ==================
// MongoDB connection
// ==================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur MongoDB :", err));

// ==================
// Start serveur
// ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`Frontend URLs autorisés : ${allowedOrigins.join(", ")}`);
  console.log("Firebase Admin initialisé ✔");
});

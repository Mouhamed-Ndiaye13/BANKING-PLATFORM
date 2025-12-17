import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import configurePassport from "./config/passport.js";


// Routes import
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js"; 
import supportRoutes from './routes/supportRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js'
import path from "path";
import paymentRoutes from "./routes/paymentRoutes.js"; 
import beneficiaireRoutes from "./routes/beneficiaireRoutes.js";
dotenv.config();
const app = express();




const allowedOrigins = process.env.FRONTEND_URLS.split(",");

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());            
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/support', supportRoutes);
app.use('/api/categories', categoryRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/payments", paymentRoutes); 
app.use("/api/beneficiaires", beneficiaireRoutes);
// Test
app.get("/test", (req, res) => {
  res.send("Test OK");
});

// MongoDB (EXISTANT)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté "))
  .catch((err) => console.error("Erreur MongoDB :", err));

// Start serveur (EXISTANT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Backend running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  console.log(`Google Auth: ${process.env.GOOGLE_CLIENT_ID ? " Activé" : " Désactivé"}`);
});

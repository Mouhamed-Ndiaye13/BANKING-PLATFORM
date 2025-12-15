import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Routes import
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js"; 
import supportRoutes from './routes/supportRoutes.js';
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();
// app.use(cors());
// app.use(express.json());


// Middleware global

app.use(cors({
  origin: "*", // Autorise toutes les origines
}));
app.use(express.json());            // Parse application/json
app.use(express.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded

// Routes principales
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes); 
app.use('/api/support', supportRoutes);

// Toutes les routes admin commencent par /admin
app.use("/admin", adminRoutes);


// Test
app.get("/test", (req, res) => {
  res.send("Test OK");
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté "))
  .catch((err) => console.error("Erreur MongoDB :", err));

// Start serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Backend running on port ${PORT}`));


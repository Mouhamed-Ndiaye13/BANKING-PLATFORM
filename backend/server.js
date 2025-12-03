
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import des routes
const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const transferRoutes = require("./routes/transferRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connecté avec succès "))
.catch((err) => console.error("Erreur MongoDB :", err));

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require('./routes/transactionRoutes');




const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.log(err));

app.use("/api/accounts", accountRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(5000, () => {
  console.log("Serveur lancé sur le port 5000");
});

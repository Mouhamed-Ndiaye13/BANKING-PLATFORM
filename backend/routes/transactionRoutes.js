// sans authenfication

// const express = require("express");
// const router = express.Router();
// const transactionController = require("../controllers/transactionController");

// //   Liste des transactions + filtres
// router.get("/", transactionController.getTransactions);

// //   Statistiques revenus / dépenses (Dashboard)
// router.get("/stats/global", transactionController.getStats);

// //   Détails d’une transaction
// router.get("/:id", transactionController.getTransactionById);

// // Transfert interne
// router.post("/transfer/internal", transactionController.internalTransfer);

// //   Transfert externe
// router.post("/transfer/external", transactionController.externalTransfer);

// module.exports = router;


// avec authen
import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  getTransactions,
  getTransactionById
} from "../controllers/transactionController.js";

const router = Router();

// GET all transactions
router.get("/", auth, getTransactions);

// GET one transaction by ID
router.get("/:id", auth, getTransactionById);

export default router;



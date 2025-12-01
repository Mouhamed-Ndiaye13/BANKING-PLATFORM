const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// Dashboard stats
router.get("/stats", transactionController.getStats);

// Transactions: liste + filtres
router.get("/", transactionController.getTransactions);

// Détails d'une transaction
router.get("/:id", transactionController.getTransactionById);

// Transfert interne
router.post("/interne-transfer", transactionController.internalTransfer);

// Transfert externe
router.post("/externe-transfer", transactionController.externalTransfer);

module.exports = router;

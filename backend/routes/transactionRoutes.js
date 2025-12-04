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
const router = require("express").Router();
const auth = require("../middleware/auth");
const transactionCtrl = require("../controllers/transactionController");

// GET tous les transactions
router.get("/", auth, transactionCtrl.getTransactions);

// GET lire un transaction
router.get("/:id", auth, transactionCtrl.getTransactionById);

module.exports = router;




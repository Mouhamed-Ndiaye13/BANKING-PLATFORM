import express from "express";
import { loginAdmin, getUsers, getAccounts, getTransactions, cancelTransaction, depositToAccount,withdrawFromAccount, deleteUser, toggleBlockUser,getTransactions, cancelTransaction  } from "../controllers/admin.controller.js";
import adminAuth from "../middleware/adminAuth.js"; // middleware JWT admin

const router = express.Router();

// LOGIN (pas besoin de token)
router.post("/login", loginAdmin);

// Toutes les autres routes nécessitent un token admin
router.get("/users", adminAuth, getUsers);
router.delete("/users/:id", adminAuth, deleteUser);
router.patch("/users/:id/block", adminAuth, toggleBlockUser);
router.get("/accounts", adminAuth, getAccounts);
router.get("/transactions", adminAuth, getTransactions);
router.post("/transactions/:id/cancel", adminAuth, cancelTransaction);
router.post("/accounts/:id/deposit", adminAuth, depositToAccount);
// Retrait
router.post("/accounts/:id/withdraw", adminAuth, withdrawFromAccount);
// GET toutes les transactions
router.get("/transactions", adminAuth, getTransactions);

// ANNULER une transaction
router.patch("/transactions/:id/cancel", adminAuth, cancelTransaction);

export default router;

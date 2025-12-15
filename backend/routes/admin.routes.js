import express from "express";
import { loginAdmin, getUsers, getAccounts, getTransactions, cancelTransaction, depositToAccount } from "../controllers/admin.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Auth Admin
router.post("/login", loginAdmin);

// Users / Accounts / Transactions
router.get("/users", adminAuth, getUsers);
router.get("/accounts", adminAuth, getAccounts);
router.get("/transactions", adminAuth, getTransactions);

// Actions Admin
router.post("/transactions/:id/cancel", adminAuth, cancelTransaction);
router.post("/accounts/:id/deposit", adminAuth, depositToAccount);

export default router;

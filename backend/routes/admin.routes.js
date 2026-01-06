import express from "express";
import {
  loginAdmin,
  getUsers,
  getAccounts,
  getTransactions,
  cancelTransaction,
  depositToAccount,
  withdrawFromAccount,
  deleteUser,
  toggleBlockUser
} from "../controllers/admin.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// LOGIN (pas besoin de token)
router.post("/login", loginAdmin);

// Middleware pour toutes les autres routes
router.use(adminAuth);

// Routes sécurisées
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/block", toggleBlockUser);

router.get("/accounts", getAccounts);
router.post("/accounts/:id/deposit", depositToAccount);
router.post("/accounts/:id/withdraw", withdrawFromAccount);

router.get("/transactions", getTransactions);
router.patch("/transactions/:id/cancel", cancelTransaction);

export default router;


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



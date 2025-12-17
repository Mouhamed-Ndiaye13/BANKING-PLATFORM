// routes/transactionRoutes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  getTransactions,
  getTransactionById
} from "../controllers/transactionController.js";

const router = Router();

router.get("/", auth, getTransactions);
router.get("/:id", auth, getTransactionById);

export default router;

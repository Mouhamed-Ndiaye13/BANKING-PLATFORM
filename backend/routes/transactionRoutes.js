
import { Router } from "express";
import auth from "../middleware/auth.js";
import { getTransactions, getTransactionById, cancelTransaction } from "../controllers/transactionController.js";

const router = Router();

router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.patch("/:id/cancel", cancelTransaction);

export default router;



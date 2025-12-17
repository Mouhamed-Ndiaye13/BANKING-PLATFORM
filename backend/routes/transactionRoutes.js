
import { Router } from "express";
import auth from "../middleware/auth.js";
import { getTransactions, getTransactionById, cancelTransaction } from "../controllers/transactionController.js";

const router = Router();

router.get("/", auth, getTransactions);
router.get("/:id", auth, getTransactionById);
router.patch("/:id/cancel", auth, cancelTransaction);

export default router;



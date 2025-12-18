// routes/transactionRoutes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import { getTransactions, getTransactionById, cancelTransaction } from "../controllers/transactionController.js";

const router = Router();

<<<<<<< HEAD
router.get("/", auth, getTransactions);
router.get("/:id", auth, getTransactionById);
=======
router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.patch("/:id/cancel", cancelTransaction);
>>>>>>> 698d0077a1545ad5acad5a4cf8e0c1d204456a88

export default router;

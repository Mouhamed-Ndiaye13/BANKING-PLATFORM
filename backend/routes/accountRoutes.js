
import express from "express";
import { getAccounts, getAccountById, createAccount, updateAccount,getBalance } from "../controllers/accountController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getAccounts);
router.get("/:id", auth, getAccountById);
router.post("/", auth, createAccount);
router.put("/:id", auth, updateAccount);
router.get("/:accountId/balance", getBalance);

export default router;

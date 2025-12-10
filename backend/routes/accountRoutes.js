
import express from "express";
import { getAccounts, getAccountById, createAccount, updateAccount } from "../controllers/accountController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getAccounts);
router.get("/:id", auth, getAccountById);
router.post("/", auth, createAccount);
router.put("/:id", auth, updateAccount);

export default router;

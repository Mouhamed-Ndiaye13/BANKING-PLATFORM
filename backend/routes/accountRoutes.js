
 //avec authentification
// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const accountCtrl = require("../controllers/accountController"); 

// router.get("/", auth, accountCtrl.getAccounts);
// router.get("/:id", auth, accountCtrl.getAccountById);
// router.post("/", auth, accountCtrl.createAccount); 
// router.put("/:id", auth, accountCtrl.updateAccount);

// module.exports = router;


import express from "express";
import { getAccounts, getAccountById, createAccount, updateAccount } from "../controllers/accountController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getAccounts);
router.get("/:id", auth, getAccountById);
router.post("/", auth, createAccount);
router.put("/:id", auth, updateAccount);

export default router;

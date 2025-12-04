
 //avec authentification
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const accountCtrl = require("../controllers/accountController"); 

router.get("/", auth, accountCtrl.getAccounts);
router.get("/:id", auth, accountCtrl.getAccountById);
router.post("/", auth, accountCtrl.createAccount); 
router.put("/:id", auth, accountCtrl.updateAccount);

module.exports = router;



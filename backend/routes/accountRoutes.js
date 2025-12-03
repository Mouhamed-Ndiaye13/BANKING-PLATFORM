 //sans authentification

// const express = require("express");
// const router = express.Router();
// const accountController = require("../controllers/accountController");

// router.post("/create", accountController.createAccount);
// router.get("/", accountController.getAllAccounts);
// router.get("/:id", accountController.getAccountById);
// router.put("/:id", accountController.updateAccount);
// router.delete("/:id", accountController.deleteAccount);

// module.exports = router;



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


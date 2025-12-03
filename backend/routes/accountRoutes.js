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
const accountController = require("../controllers/accountController");
const { auth } = require("../middleware/auth");

router.post("/create", auth, accountController.createAccount);
router.get("/", auth, accountController.getAllAccounts);
router.get("/:id", auth, accountController.getAccountById);
router.put("/:id", auth, accountController.updateAccount);
router.delete("/:id", auth, accountController.deleteAccount);

module.exports = router;


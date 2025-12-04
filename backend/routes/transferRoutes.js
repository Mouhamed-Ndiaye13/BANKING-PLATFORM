
const router = require("express").Router();
const auth = require("../middleware/auth");
const transferCtrl = require("../controllers/transferController");

// Internal transfer
router.post("/internal", auth, transferCtrl.internalTransfer);

// External transfer
router.post("/external", auth, transferCtrl.externalTransfer);

module.exports = router;

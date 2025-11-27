const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const ctrl = require("../controllers/userController");

router.get("/me", auth, ctrl.me);
router.get("/", auth, isAdmin, ctrl.list);
router.get("/:id", auth, isAdmin, ctrl.get);
router.put("/:id", auth, isAdmin, ctrl.update);
router.delete("/:id", auth, isAdmin, ctrl.remove);



module.exports = router;

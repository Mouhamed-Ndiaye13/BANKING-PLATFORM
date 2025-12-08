// routes/userRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";
import * as ctrl from "../controllers/userController.js";

const router = express.Router();

router.get("/me", auth, ctrl.me);
router.get("/", auth, isAdmin, ctrl.list);
router.get("/:id", auth, isAdmin, ctrl.get);
router.put("/:id", auth, isAdmin, ctrl.update);
router.delete("/:id", auth, isAdmin, ctrl.remove);

export default router;

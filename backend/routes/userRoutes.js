import express from "express";
import { list, get, update, remove, create } from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/", auth, isAdmin, list);
router.get("/:id", auth, isAdmin, get);
router.put("/:id", auth, isAdmin, update);
router.delete("/:id", auth, isAdmin, remove);
router.post("/", auth, isAdmin, create);

export default router;

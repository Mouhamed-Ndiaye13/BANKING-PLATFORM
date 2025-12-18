import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.patch("/:id/read", verifyToken, markAsRead);

export default router;

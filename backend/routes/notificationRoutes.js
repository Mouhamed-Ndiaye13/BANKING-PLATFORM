import express from "express";
<<<<<<< HEAD
import { getNotifications, markAsRead } from "../controllers/notificationControllers.js";
import auth from "../middleware/auth.js";
// import { } from "../middleware/auth.js";
=======
import { getNotifications, markAsRead } from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
>>>>>>> 698d0077a1545ad5acad5a4cf8e0c1d204456a88

const router = express.Router();

router.get("/", auth, getNotifications);
router.patch("/:id/read", auth, markAsRead);

export default router;

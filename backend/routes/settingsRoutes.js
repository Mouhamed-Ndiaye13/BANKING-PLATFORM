import express from "express";
import { updateProfile, changePassword, updateAvatar } from "../controllers/settingsController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.put("/update-profile", auth, updateProfile);
router.put("/change-password", auth, changePassword);
router.put("/update-avatar", auth, upload.single("avatar"), updateAvatar);

export default router;

// routes/googleAuthRoutes.js
import express from "express";
import { googleLogin } from "../controllers/googleAuthController.js";

const router = express.Router();

// POST /api/auth/google
router.post("/google", googleLogin);

export default router;

import express from "express";
import { googleLogin } from "../controllers/googleAuthController.js";

const router = express.Router();

// POST /auth/google
router.post("/", googleLogin);

export default router;

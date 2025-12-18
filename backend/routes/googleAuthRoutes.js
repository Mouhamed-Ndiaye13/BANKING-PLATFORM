import express from "express";
import { verifyGoogleToken } from "../controllers/googleAuthController.js";

const router = express.Router();

router.post("/google-login", verifyGoogleToken);

export default router;

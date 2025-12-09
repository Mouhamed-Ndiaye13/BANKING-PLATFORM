import express from "express";
import { createCard } from "../controllers/cardController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// POST /api/cards
router.post("/", authMiddleware, createCard);

export default router;

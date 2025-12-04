
// const express = require('express');
// const router = express.Router();
// const ctrl = require('../controllers/authController');

// router.post('/register', ctrl.register);
// router.post('/login', ctrl.login);
// router.post('/forgot-password', ctrl.forgotPassword);
// router.post('/reset-password/:token', ctrl.resetPassword);

// module.exports = router;
import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;

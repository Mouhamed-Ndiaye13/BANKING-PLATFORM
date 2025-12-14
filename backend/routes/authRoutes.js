
// const express = require('express');
// const router = express.Router();
// const ctrl = require('../controllers/authController');

// router.post('/register', ctrl.register);
// router.post('/login', ctrl.login);
// router.post('/forgot-password', ctrl.forgotPassword);
// router.post('/reset-password/:token', ctrl.resetPassword);

// module.exports = router;
import express from "express";
const router = express.Router();
import {
  register,
  login,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";



router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


export default router;

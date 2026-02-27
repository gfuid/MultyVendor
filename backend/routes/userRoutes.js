/**
 * USER ROUTES (Profile aur Session Management)
 * Purpose: Is file ka main kaam user ki personal profile aur account status manage karna hai.
 */

const express = require('express');
const router = express.Router();

// 1. CONTROLLER IMPORT: User ki details fetch karne ka logic
const { getMe } = require('../controllers/userController');

// 2. MIDDLEWARE IMPORT: Private access ensure karne ke liye
// 'protect' middleware bina valid token ke kisi ko aage nahi jaane dega.
const { protect } = require('../middleware/authMiddleware');

/**
 * ============================================================
 * PRIVATE PROFILE ROUTES (Sirf Logged-in Users ke liye)
 * ============================================================
 */

// @desc: Current logged-in user ka poora data (name, email, role) mangwana
// Route: GET /api/users/me
// 'protect' pehle token verify karega, phir 'getMe' controller data bhejega.
router.get('/me', protect, getMe);

module.exports = router;
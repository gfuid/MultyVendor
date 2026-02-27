/**
 * AUTH ROUTES (Identity aur Entry Gateway)
 * Purpose: Is file mein authentication se jude saare raste (routes) define hain.
 */

const express = require('express');
const router = express.Router();

// 1. CONTROLLER IMPORTS: Logic ko routes ke saath jodna
const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

// 2. MIDDLEWARE IMPORTS: Security layer (if needed)
const { protect } = require('../middleware/authMiddleware');

/**
 * ============================================================
 * PUBLIC AUTH ROUTES (Khule Raste - No Token Needed)
 * ============================================================
 */

// @desc: Naya user ya vendor register karne ke liye
router.post('/register', registerUser);

// @desc: Existing user ko login karwa kar JWT token dene ke liye
router.post('/login', loginUser);

/**
 * ============================================================
 * PASSWORD RECOVERY ROUTES (Account Wapsi ka Process)
 * ============================================================
 */

// @desc: Email par reset link/token bhejne ke liye
// Route: POST /api/auth/forgotpassword
router.post('/forgotpassword', forgotPassword);

// @desc: Token verify karke naya password set karne ke liye
// Route: PUT /api/auth/resetpassword/:resettoken
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
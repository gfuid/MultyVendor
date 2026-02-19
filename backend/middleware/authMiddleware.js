/**
 * AUTHENTICATION & AUTHORIZATION MIDDLEWARE
 * Purpose: User ki identity verify karna aur restrict karna ki kaun kaunse APIs access kar sakta hai.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * ============================================================
 * 1. PROTECT MIDDLEWARE (Identity Verification)
 * ============================================================
 * @desc    JWT Token ko verify karke user ko authenticate karna.
 * @logic   Yeh middleware check karta hai ki request ke header mein 'Bearer Token' hai ya nahi.
 * Agar hai, toh use decode karke user ka data database se nikaalta hai.
 */
const protect = async (req, res, next) => {
    let token;

    // Check karein ki Authorization header 'Bearer' se shuru ho raha hai
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Header se actual token string nikaalna: "Bearer <token>" -> "<token>"
            token = req.headers.authorization.split(' ')[1];

            // Token ko verify karna: JWT_SECRET ke bina ise decode nahi kiya ja sakta
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Verified user ki ID ke basis par DB se data nikaalna (Password hata kar)
            // 'req.user' ko object mein save karte hain taaki agle controllers ise use kar sakein
            req.user = await User.findById(decoded.id).select('-password');

            // Agle middleware ya controller par bhejna
            next();
        } catch (error) {
            console.error("Auth Token Error:", error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // Agar token hi nahi mila toh access mana kar dena
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * ============================================================
 * 2. ADMIN MIDDLEWARE (VIP Access Check)
 * ============================================================
 * @desc    Check karna ki authenticated user ka role 'admin' hai ya nahi.
 * @logic   Yeh 'protect' ke baad lagaya jata hai taaki 'req.user' pehle se available ho.
 */
const admin = (req, res, next) => {
    // Check karein ki user exist karta hai aur uska role 'admin' hai
    if (req.user && req.user.role === 'admin') {
        next(); // Permission granted
    } else {
        // 403 Forbidden: User authenticated toh hai, par uske paas admin powers nahi hain
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

/**
 * EXPORT:
 * 'protect' ko kisi bhi private route ke liye use karein.
 * 'admin' ko sirf un routes ke liye jahan admin ki zaroorat hai (e.g., Vendor Approval).
 */
module.exports = { protect, admin };
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * 1. PROTECT MIDDLEWARE
 * Purpose: Token verify karke user object (req.user) banana.
 */
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // JWT Secret se token verify karein
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // DYNAMIC FIX: Seedha DB se user nikaalein (No static_admin checks)
            // .select('-password') security ke liye password hide kar deta hai
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(404).json({ message: 'User not found' });
            }

            next();
        } catch (error) {
            console.error("Auth Token Error:", error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * 2. ADMIN MIDDLEWARE
 * Purpose: DB Role check karna.
 */
const admin = (req, res, next) => {
    // Ab ye check har admin par chalega jo DB mein 'admin' role rakhta hai
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        // Forbidden logic jab user admin nahi hai
        res.status(403).json({ message: 'Access Denied: Admin privileges required' });
    }
};

module.exports = { protect, admin };
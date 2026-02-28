// ============================================================
// userController.js — Redis Caching ke saath
// /api/users/me baar baar call hota hai har page load pe
// Redis se DB trips bachte hain
// ============================================================
const User = require('../models/User');
const redisClient = require('../config/redis').redisClient;

// User data zyada nahi badlta — 10 minute cache theek hai
const CACHE_TTL = 600;

// ============================================================
// GET LOGGED-IN USER KI INFO
// GET /api/users/me
// ============================================================
const getMe = async (req, res) => {
    try {
        // Har user ka alag cache key — user ID se
        const cacheKey = `user:${req.user.id}`;

        // Redis mein check karo pehle
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            console.log(`⚡ User profile served from Redis`);
            return res.status(200).json({ success: true, user: JSON.parse(cached) });
        }

        // Nahi mila toh DB se lo — password field exclude karo security ke liye
        const user = await User.findById(req.user.id).select('-password');

        if (!user)
            return res.status(404).json({ message: "User not found." });

        // Sirf zaroorat ki fields bhejo — zyada data nahi
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,           // Dashboard routing ke liye — admin/seller/user
            isSeller: user.isSeller,   // Seller features dikhaane ke liye
            sellerStatus: user.sellerStatus, // Pending/Approved status
            logo: user.logo || ""
        };

        // Cache mein store karo agla request ke liye
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(userData));

        res.status(200).json({ success: true, user: userData });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user profile." });
    }
};

module.exports = { getMe };
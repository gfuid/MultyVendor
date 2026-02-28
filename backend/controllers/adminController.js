const User = require('../models/User');
const Product = require('../models/Product');
const Store = require('../models/Store');
const { redisClient } = require('../config/redis'); // Fast Data access ke liye Redis client

/**
 * ============================================================
 * CACHE UTILITY (Safaai Abhiyaan)
 * ============================================================
 * @desc Jab bhi DB mein badlav ho, purana (stale) cache delete karna zaroori hai.
 */
const clearAdminCache = async (key) => {
    // Redis se specific key hatana taaki agla request fresh data laaye
    await redisClient.del(key);
};

/**
 * ============================================================
 * 1. GET ALL VENDORS (Vendor List Fetching)
 * ============================================================
 * @desc Saare registered sellers ki list nikalna (With Redis Optimization)
 */
// controllers/adminController.js

const getAllVendors = async (req, res) => {
    try {
        // 'Store' collection se data fetch karein aur owner ki details join karein
        const vendors = await Store.find().populate('owner', 'name email');
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch vendors" });
    }
};

/**
 * ============================================================
 * 2. UPDATE VENDOR STATUS (Approval/Suspension)
 * ============================================================
 * @desc Kisi vendor ko marketplace se block ya allow karna
 */
const updateVendorStatus = async (req, res) => {
    try {
        const { isApproved } = req.body;
        // 1. User ko suspend/approve karein
        const user = await User.findByIdAndUpdate(req.params.id, {
            isApproved,
            sellerStatus: isApproved ? 'approved' : 'rejected'
        }, { new: true });

        // 2. Store ko suspend/approve karein (Asli fix yahan hai)
        await Store.findOneAndUpdate(
            { owner: req.params.id },
            { status: isApproved ? 'approved' : 'rejected' }
        );

        await clearAdminCache('admin:vendors');
        res.status(200).json({ success: true, message: "Status Synced!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ============================================================
 * 3. GET ALL PRODUCTS ADMIN (Global Catalog)
 * ============================================================
 * @desc Pure marketplace ke saare products ek saath dekhna
 */
const getAllProductsAdmin = async (req, res) => {
    try {
        const cacheKey = 'admin:products';
        const cachedProducts = await redisClient.get(cacheKey);

        // Cache mein bhi success object bhejien
        if (cachedProducts) {
            return res.status(200).json({ success: true, products: JSON.parse(cachedProducts) });
        }

        // 'seller' populate karna zaroori hai details page ke liye
        const products = await Product.find({}).populate('seller', 'name email');

        await redisClient.setEx(cacheKey, 1800, JSON.stringify(products));

        // Frontend expects: { success: true, products: [...] }
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Products fetch error" });
    }
};

/**
 * ============================================================
 * 4. ADMIN DELETE PRODUCT (Moderation)
 * ============================================================
 * @desc Kisi bhi galat product ko marketplace se hatana
 */
const adminDeleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product missing hai" });

        // DB se delete karna
        await product.deleteOne();

        // ⚠️ CACHE SYNC: Agli baar Admin ko updated list dikhni chahiye
        await clearAdminCache('admin:products');

        res.status(200).json({ message: "Admin has removed the product" });
    } catch (error) {
        res.status(500).json({ message: "Deletion error", error: error.message });
    }
};

/**
 * ============================================================
 * 5. APPROVE STORE (Vendor Onboarding Final Step)
 * ============================================================
 * @desc Naye store ko live karna aur User ko 'Seller' ka darja dena
 */
const approveStore = async (req, res) => {
    try {
        const { storeId } = req.params;

        // 1. Store collection mein status 'approved' karna
        const store = await Store.findByIdAndUpdate(storeId, { status: 'approved' }, { new: true });
        if (!store) return res.status(404).json({ message: "Store record not found" });

        // 2. USER UPDATE: User model mein seller flag true karna
        // Taaki user Vendor Dashboard access kar sake
        await User.findByIdAndUpdate(store.owner, {
            isSeller: true,
            sellerStatus: 'approved'
        });

        // ⚠️ DATA CONSISTENCY: Vendors ki cache list ko clear karna
        await clearAdminCache('admin:vendors');

        res.status(200).json({
            success: true,
            message: " Store and User both approved successfully."
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * GET DASHBOARD STATS
 * Purpose: Aggregates real data from Users, Stores, and Products collections.
 */
const getDashboardStats = async (req, res) => {
    try {
        const totalVendors = await Store.countDocuments({ status: 'approved' });
        const pendingApprovals = await Store.countDocuments({ status: 'pending' });
        const totalCustomers = await User.countDocuments({ role: 'user' });

        // Product analytics
        const totalProducts = await Product.countDocuments();

        res.status(200).json({
            totalVendors,
            pendingApprovals,
            totalCustomers,
            totalProducts,
            totalRevenue: "₹0" // Sales logic integrate hone par update hoga
        });
    } catch (error) {
        res.status(500).json({ message: "Stats fetch failed " });
    }
};

// Admin Controller
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, users }); // "users" key zaroori hai
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Admin Controller: Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check karein ki admin khud ko delete na kar le (Safety Check)
        if (req.user.id === id) {
            return res.status(400).json({ message: "You cannot delete yourself" });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User permanently deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    getAllVendors,
    updateVendorStatus,
    getAllProductsAdmin,
    adminDeleteProduct,
    approveStore,
    getDashboardStats,
    getAllUsers,
    deleteUser
};
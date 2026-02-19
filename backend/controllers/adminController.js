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
const getAllVendors = async (req, res) => {
    try {
        const cacheKey = 'admin:vendors';

        // 1. CACHE CHECK: MongoDB tak jaane se pehle Redis se pucho
        const cachedVendors = await redisClient.get(cacheKey);
        if (cachedVendors) {
            console.log("⚡ Serving Vendors from Redis Cloud");
            return res.status(200).json(JSON.parse(cachedVendors));
        }

        // 2. DB QUERY: Agar cache khali hai, toh MongoDB se search karo
        // Password field ko security ke liye select nahi kar rahe
        const vendors = await User.find({ isSeller: true }).select('-password');

        // 3. CACHE SET: Agle 30 minutes (1800s) ke liye data store kar lo
        await redisClient.setEx(cacheKey, 1800, JSON.stringify(vendors));

        res.status(200).json(vendors);
    } catch (error) {
        // Error ke case mein khali array bhej rahe hain taaki frontend crash na ho
        res.status(500).json([]);
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
        const vendor = await User.findById(req.params.id);

        if (!vendor) return res.status(404).json({ message: "Vendor nahi mila" });

        // Status update karna
        vendor.isApproved = isApproved;
        await vendor.save();

        // ⚠️ INVALIDATION: Vendor list ab purani ho chuki hai, isliye cache delete karein
        await clearAdminCache('admin:vendors');

        res.status(200).json({
            message: `Vendor ${isApproved ? 'Approve' : 'Suspend'} kar diya gaya hai`,
            vendor
        });
    } catch (error) {
        res.status(500).json({ message: "Status update fail", error: error.message });
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

        // REDIS LOOKUP: System ki speed badhane ke liye
        const cachedProducts = await redisClient.get(cacheKey);
        if (cachedProducts) {
            return res.status(200).json(JSON.parse(cachedProducts));
        }

        // POPULATE: Vendor ki details (Name, Email) bhi saath mein fetch karna
        const products = await Product.find({}).populate('vendor', 'name email storeName');

        // CACHE FILL: 30 minutes tak ke liye result store karna
        await redisClient.setEx(cacheKey, 1800, JSON.stringify(products));

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Products fetch nahi ho paye", error: error.message });
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

        res.status(200).json({ message: "Admin ne product remove kar diya" });
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
        if (!store) return res.status(404).json({ message: "Store record nahi mila" });

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
            message: "Mubarak ho! Store aur User dono approve ho gaye hain."
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllVendors,
    updateVendorStatus,
    getAllProductsAdmin,
    adminDeleteProduct,
    approveStore
};
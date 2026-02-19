const Store = require('../models/Store');
const User = require('../models/User');
const { redisClient } = require('../config/redis'); // Redis client import

/**
 * ============================================================
 * 1. SELLER APPLICATION (Naya Store Register Karein)
 * ============================================================
 * @desc    Naya store create karna aur user status 'pending' karna
 * @route   POST /api/stores/apply
 * @access  Private (User Only)
 */
exports.applyForStore = async (req, res) => {
    try {
        const { storeName, phone, address, category, taxId } = req.body;

        // FILE HANDLING: Multer relative path generate karta hai local storage ke liye
        const storeLogo = req.file ? `/uploads/${req.file.filename}` : "";

        // DB ENTRY: Store collection mein data save karna
        const store = await Store.create({
            owner: req.user.id, // Login user ki ID mapping
            storeName,
            phone,
            address,
            category,
            taxId,
            logo: storeLogo
        });

        // USER UPDATE: User ka status 'pending' karna admin approval ke liye
        await User.findByIdAndUpdate(req.user.id, { sellerStatus: 'pending' });

        // REDIS CLEANUP: Purani store lists ya user profile ka cache clear karein
        await redisClient.del(`user:profile:${req.user.id}`);

        res.status(201).json({
            success: true,
            message: "Application submitted successfully! Admin will review it.",
            store
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ============================================================
 * 2. GET STORE DETAILS (Settings & Dashboard Data)
 * ============================================================
 * @desc    Owner ID ke basis par store details dikhana (With Redis Caching)
 * @route   GET /api/stores/me
 * @access  Private (Seller Only)
 */
exports.getStoreDetails = async (req, res) => {
    try {
        const cacheKey = `store:details:${req.user.id}`;

        // 1. REDIS CHECK: Kya store details RAM mein hain?
        const cachedStore = await redisClient.get(cacheKey);
        if (cachedStore) {
            console.log("⚡ Serving Store Details from Redis");
            return res.status(200).json(JSON.parse(cachedStore));
        }

        // 2. DB FETCH: Agar cache mein nahi hai toh MongoDB se lein
        const store = await Store.findOne({ owner: req.user.id });

        if (!store) {
            return res.status(404).json({ message: "Store details nahi mili" });
        }

        // 3. REDIS SET: Agli baar ke liye cache mein save karein (1 ghante ke liye)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(store));

        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ============================================================
 * 3. UPDATE STORE SETTINGS (Profile Edit Karein)
 * ============================================================
 * @desc    Store details update karna aur Redis cache invalidate karna
 * @route   PUT /api/stores/update
 * @access  Private (Seller Only)
 */
exports.updateStoreSettings = async (req, res) => {
    try {
        const { storeName, storeDescription, contactPhone, storeAddress } = req.body;

        // DB UPDATE: Store collection update karein
        const updatedStore = await Store.findOneAndUpdate(
            { owner: req.user.id },
            {
                storeName,
                description: storeDescription,
                phone: contactPhone,
                address: storeAddress
            },
            { new: true, runValidators: true }
        );

        if (!updatedStore) {
            return res.status(404).json({ message: "Store record nahi mila" });
        }

        // CACHE INVALIDATION: Data badal gaya hai, isliye purana cache delete karein
        await redisClient.del(`store:details:${req.user.id}`);
        // Optionally public store list ka cache bhi uda sakte hain agar banaya hai toh

        res.status(200).json({
            success: true,
            message: "Store settings updated successfully!",
            store: updatedStore
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Server crash: Check logs" });
    }
};
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

// @desc    Apply for seller account
exports.applyForSeller = async (req, res) => {
    try {
        const data = req.body;

        // Validation Check: Pehle check karein ki zaroori fields aa rahi hain ya nahi
        if (!data.storeName || !data.bankAccount) {
            return res.status(400).json({ message: "Mandatory fields are missing" });
        }

        const newStore = new Store({
            owner: req.user._id,
            businessInfo: {
                storeName: data.storeName,
                category: data.category,
                description: data.description,
                supportEmail: data.supportEmail,
                experience: Number(data.experience), // ❌ FIX: String ko Number mein convert karein
                logo: req.files?.logo ? req.files.logo[0].path : ""
            },
            legalInfo: {
                taxId: data.taxId,
                panCard: data.panCard,
                drugLicenseGeneral: data.drug,
                pharmacySpecific: {
                    licenseNumber: data.drugLicenseNumber || "",
                    licenseProof: req.files?.drugLicenseFile ? req.files.drugLicenseFile[0].path : ""
                }
            },
            bankingInfo: {
                accountHolderName: data.accountHolderName,
                bankName: data.bankName,
                branchName: data.branchName,
                bankAccount: data.bankAccount,
                accountType: data.accountType,
                ifscCode: data.ifscCode,
                phone: data.phone,
                pickupAddress: data.address // ❌ FIX: Frontend 'address' ko 'pickupAddress' mein map karein
            }
        });

        await newStore.save();

        // User Status Update
        await User.findByIdAndUpdate(req.user._id, {
            sellerStatus: 'pending',
            isSeller: false
        });

        res.status(201).json({ success: true, message: "Application submitted!" });
    } catch (error) {
        console.error("Submission Error Details:", error.errors); // Isse detail mein error dikhega
        res.status(500).json({ message: "Store validation failed: Check all fields" });
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
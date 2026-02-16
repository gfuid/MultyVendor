const Store = require('../models/Store');
const User = require('../models/User');

/**
 * 1. SELLER APPLICATION: Naya store register karne ke liye
 * Frontend: BecomeSeller.jsx
 */
exports.applyForStore = async (req, res) => {
    try {
        const { storeName, phone, address, category, taxId } = req.body;

        // Multer relative path generate karta hai local storage ke liye
        const storeLogo = req.file ? `/uploads/${req.file.filename}` : "";

        // Store collection mein entry create karna
        const store = await Store.create({
            owner: req.user.id, // Login user ki ID mapping
            storeName,
            phone,
            address,
            category,
            taxId,
            logo: storeLogo
        });

        // User ka status 'pending' karna admin approval ke liye
        await User.findByIdAndUpdate(req.user.id, { sellerStatus: 'pending' });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully!",
            store
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * 2. GET STORE DETAILS: Store settings page par data dikhane ke liye
 * Frontend: StoreSettings.jsx (useEffect)
 */
exports.getStoreDetails = async (req, res) => {
    try {
        // Owner ID ke basis par 'stores' collection se data nikalna
        const store = await Store.findOne({ owner: req.user.id });

        if (!store) {
            return res.status(404).json({ message: "Store details nahi mili" });
        }

        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * 3. UPDATE STORE SETTINGS: Store details edit/update karne ke liye
 * FIX: Ise 'Store' model par chalana hai, 'User' par nahi.
 */
exports.updateStoreSettings = async (req, res) => {
    try {
        // Frontend se aane wale data ko destructure karein
        const { storeName, storeDescription, contactPhone, storeAddress } = req.body;

        // User ID (owner) ke basis par 'Store' collection update karein
        const updatedStore = await Store.findOneAndUpdate(
            { owner: req.user.id },
            {
                storeName,
                description: storeDescription, // DB field: description
                phone: contactPhone,           // DB field: phone
                address: storeAddress          // DB field: address
            },
            { new: true, runValidators: true }
        );

        if (!updatedStore) {
            return res.status(404).json({ message: "Store record nahi mila" });
        }

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
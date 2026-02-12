const Store = require('../models/Store');
const User = require('../models/User');
// vendorRoutes.js
const { protect } = require('../middleware/authMiddleware'); // Check spelling and path!


exports.applyForStore = async (req, res) => {
    try {
        const { storeName, phone, address, category, taxId } = req.body;

        // Multer file ki detail req.file mein deta hai
        const storeLogo = req.file ? `/uploads/${req.file.filename}` : ""; // Relative path


        const store = await Store.create({
            owner: req.user.id,
            storeName,
            phone,
            address,
            category,
            taxId,
            logo: storeLogo // Image URL/Path save ho raha hai
        });

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



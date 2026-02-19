const express = require('express');
const router = express.Router();
const {
    getAllVendors,
    updateVendorStatus,
    getAllProductsAdmin,
    adminDeleteProduct,
    approveStore
} = require('../controllers/adminController');

const { protect, admin } = require('../middleware/authMiddleware');

// Debugging (Sirf functions check karne ke liye)
console.log("✅ Admin Functions Check:", {
    getAllVendors: typeof getAllVendors,
    approveStore: typeof approveStore
});

// --- Sabhi Routes ---
router.get('/vendors', protect, admin, getAllVendors);
router.put('/vendor/:id/status', protect, admin, updateVendorStatus);
router.put('/store/approve/:storeId', protect, admin, approveStore);
router.get('/products', protect, admin, getAllProductsAdmin);
router.delete('/product/:id', protect, admin, adminDeleteProduct);

module.exports = router;
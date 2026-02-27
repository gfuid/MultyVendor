/**
 * VENDOR ROUTES (Onboarding aur Store Management)
 * Purpose: Is file ka kaam normal users ko sellers mein badalna aur unki shop details manage karna hai.
 */

const express = require('express');
const router = express.Router();

// 1. MIDDLEWARE IMPORTS: Security aur File Handling
// 'upload' middleware logo ko Cloudinary par bhejta hai.
// 'protect' middleware user ki identity verify karta hai.
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// 2. CONTROLLER IMPORTS: Store logic ko execute karne ke liye
const {
    applyForSeller,
    updateStoreSettings,
    getStoreDetails
} = require('../controllers/vendorController');

/**
 * ============================================================
 * VENDOR ONBOARDING (Seller Banne ka Process)
 * ============================================================
 */

// @desc: Naye store ke liye apply karna (Become a Seller)
// 'upload.single('logo')' frontend ke 'logo' field se image uthakar cloud par save karega.
// Route exactly match hona chahiye
router.post('/apply', protect, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'drugLicenseFile', maxCount: 1 }
]), applyForSeller);

/**
 * ============================================================
 * STORE MANAGEMENT (Shop Settings Update)
 * ============================================================
 */

// @desc: Dukandaar ki details (Name, Address, Phone) update karna
// Route: PUT /api/vendors/update-store
router.put('/update-store', protect, updateStoreSettings);

// @desc: Dashboard ya Settings page ke liye store ki current details fetch karna
// Isme Redis caching logic controller level par handle kiya gaya hai.
router.get('/settings', protect, getStoreDetails);

module.exports = router;
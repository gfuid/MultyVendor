const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
// Yahan aapne functions ko nikal liya hai
const { applyForStore, updateStoreSettings, getStoreDetails } = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');

// 'logo' wahi name hai jo humne frontend FormData mein append kiya tha
router.post('/apply', protect, upload.single('logo'), applyForStore);

// FIX: Yahan 'vendorController.' hatayein kyunki function direct import hai
router.put('/update-store', protect, updateStoreSettings);

// backend/routes/vendorRoutes.js
router.get('/settings', protect, getStoreDetails);

module.exports = router;
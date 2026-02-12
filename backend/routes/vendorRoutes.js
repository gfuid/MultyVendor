const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { applyForStore } = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');

// 'logo' wahi name hai jo humne frontend FormData mein append kiya tha
router.post('/apply', protect, upload.single('logo'), applyForStore);

module.exports = router;
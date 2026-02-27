// backend/routes/cartRoutes.js
const express = require('express');
const router = express.Router();

// YAHAN FIX HAI: updateCartItem ko zaroor add karein
const { addToCart, getCart, updateCartItem } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);

// Ab ye line error nahi degi
router.put('/update', protect, updateCartItem);

module.exports = router;
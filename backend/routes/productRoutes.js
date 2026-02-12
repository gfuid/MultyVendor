// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Debugging line (Ise console mein check karein)
console.log("Controller methods:", Object.keys(productController));

// Routes
router.post('/add', protect, upload.array('images', 5), productController.addProduct);
router.get('/my-products', protect, productController.getVendorProducts);

module.exports = router;
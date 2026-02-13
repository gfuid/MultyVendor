const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Routes definitions
router.post('/add', protect, upload.array('images', 5), productController.addProduct);
router.get('/my-products', protect, productController.getVendorProducts);

// Single product fetch karne ka route (Edit functionality ke liye zaruri hai)
router.get('/:id', protect, productController.getProductById);

// Delete route
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;
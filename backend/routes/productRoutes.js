const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { storage } = require('../config/cloudinary');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware'); // Yeh line zaruri hai

// Multer configuration for Cloudinary
const upload = multer({ storage });

// 1. ADD PRODUCT: Images direct Cloudinary par jayengi aur URLs DB mein save honge
router.post('/add', protect, upload.array('images', 5), productController.addProduct);

// 2. GET VENDOR PRODUCTS: Seller ke apne products fetch karne ke liye
router.get('/my-products', protect, productController.getVendorProducts);

// 3. GET SINGLE PRODUCT: Edit ya View ke liye
router.get('/:id', protect, productController.getProductById);

// 4. DELETE PRODUCT: Product hatane ke liye
router.delete('/:id', protect, productController.deleteProduct);

// 5. UPDATE PRODUCT: Details edit karne ke liye
router.put('/:id', protect, productController.updateProduct);

module.exports = router;
/**
 * ADMIN ROUTES (Marketplace ka Control Center)
 * Purpose: Is file mein saare un routes ki list hai jo sirf Admin use kar sakta hai.
 */

const express = require('express');
const router = express.Router();

// 1. CONTROLLER IMPORTS
const {
    getAllVendors,
    updateVendorStatus,
    getAllProductsAdmin,
    adminDeleteProduct,
    approveStore,
    getDashboardStats,
    getAllUsers,
    deleteUser
} = require('../controllers/adminController');

// 2. MIDDLEWARE IMPORTS
// 'protect' check karta hai ki user logged in hai ya nahi.
// 'admin' check karta hai ki user ka role 'admin' hai ya nahi.
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * ============================================================
 * VENDOR & STORE MANAGEMENT (Dukandaar aur Store Control)
 * ============================================================
 */

// @desc: Saare registered vendors ki list nikalna (Redis cache logic ke saath)
router.get('/vendors', protect, admin, getAllVendors);

// @desc: Kisi vendor ko suspend karna ya wapas active karna
router.put('/vendor/:id/status', protect, admin, updateVendorStatus);

// @desc: Naye store application ko approve karna taaki seller apna maal bech sake
router.put('/store/approve/:storeId', protect, admin, approveStore);

/**
 * ============================================================
 * PRODUCT MODERATION (Global Maal ki Nigrani)
 * ============================================================
 */

// @desc: Poore marketplace ke saare products ek saath dekhna
router.get('/products', protect, admin, getAllProductsAdmin);

// @desc: Kisi bhi galat ya unauthorized product ko marketplace se delete karna
router.delete('/product/:id', protect, admin, adminDeleteProduct);

// Is line ko update karein (for consistency with Redux)
router.get('/stats', protect, admin, getDashboardStats);

// adminRoutes.js
router.get('/users', protect, admin, getAllUsers); // '/user' nahi, '/users' likhein

// @desc: Kisi user ka account delete karna
router.delete('/users/:id', protect, admin, deleteUser);


module.exports = router;
const express = require('express');
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
    getSellerOrders,
    createRazorpayOrder
} = require('../controllers/orderController');

const { protect, admin } = require('../middleware/authMiddleware');

// ============================================================
// ⚠️  IMPORTANT: Specific routes PEHLE aani chahiye, generic baad mein
//     Warna /myorders aur /seller/dashboard /:id se match ho jaenge
// ============================================================

// POST /api/orders/razorpay — Razorpay order ID generate karna
router.post('/razorpay', protect, createRazorpayOrder);

// POST /api/orders — Naya order create karna
router.post('/', protect, createOrder);

// GET /api/orders/myorders — Logged-in user ke apne orders
router.get('/myorders', protect, getMyOrders);

// GET /api/orders/seller/dashboard — Seller ke orders
router.get('/seller/dashboard', protect, getSellerOrders);

// GET /api/orders — Admin: Saare orders (specific routes ke baad)
router.get('/', protect, admin, getAllOrders);

// GET /api/orders/:id — Specific order by ID (last mein kyunki generic hai)
router.get('/:id', protect, getOrderById);

// PUT /api/orders/:id/status — Admin: Order status update
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
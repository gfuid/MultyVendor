// ============================================================
// orderController.js — Redis Caching ke saath
// Order data sensitive hai — status change pe sab caches clear
// ============================================================
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const redisClient = require('../config/redis').redisClient;
const crypto = require("crypto");
// Order data 3 minute cache — jaldi stale nahi hota
const CACHE_TTL = 180;

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ============================================================
// 1. RAZORPAY ORDER ID GENERATE KARO
// POST /api/orders/razorpay
// ============================================================
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount)
            return res.status(400).json({ message: "Payment amount is required." });

        // Razorpay ko paise mein amount chahiye — rupees * 100
        const razorOrder = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        });

        res.status(200).json({ success: true, razorOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create payment order." });
    }
};

// ============================================================
// 2. NAYA ORDER BANAO
// POST /api/orders
// ============================================================
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shippingAddress, paymentMethod, paymentStatus } = req.body;

        if (!shippingAddress)
            return res.status(400).json({ message: "Shipping address is required." });

        // Cart fetch karo with product details
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0)
            return res.status(400).json({ message: "Your cart is empty. Add products before placing an order." });

        // Cart items se order items banao
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            seller: item.product.seller, // Seller ke orders filter ke liye zaroori
            quantity: item.quantity,
            price: item.product.price
        }));

        const totalAmount = orderItems.reduce(
            (acc, item) => acc + (item.price * item.quantity), 0
        );

        // Order MongoDB mein save karo
        const order = await Order.create({
            buyer: userId,
            items: orderItems,
            shippingAddress,
            totalAmount,
            paymentMethod: paymentMethod || 'COD',
            paymentStatus: paymentStatus || 'pending'
        });

        // Order place hua — cart saaf karo
        cart.items = [];
        await cart.save();

        // Order aaya toh buyer aur seller dono ke caches clear karo
        await redisClient.del(`my_orders:${userId}`);
        await redisClient.del(`cart:${userId}`);
        await redisClient.del('all_orders');

        // Jo sellers involved hain unka cache bhi clear karo
        const sellerIds = [...new Set(
            orderItems.map(i => i.seller?.toString()).filter(Boolean)
        )];
        for (const sid of sellerIds) {
            await redisClient.del(`seller_orders:${sid}`);
        }

        // Confirmation email async bhejo — response slow nahi hoga
        sendConfirmationEmail(req.user.email, order, shippingAddress, totalAmount);

        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to place order. Please try again." });
    }
};

// ============================================================
// 3. MERA ORDERS HISTORY
// GET /api/orders/myorders
// ============================================================
exports.getMyOrders = async (req, res) => {
    try {
        // Har buyer ka alag cache
        const cacheKey = `my_orders:${req.user.id}`;

        const cached = await redisClient.get(cacheKey);
        if (cached) {
            console.log(`⚡ My orders served from Redis`);
            return res.status(200).json({ success: true, orders: JSON.parse(cached) });
        }

        const orders = await Order.find({ buyer: req.user.id })
            .populate('items.product', 'name images price')
            .sort('-createdAt');

        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(orders));
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch your orders." });
    }
};

// ============================================================
// 4. SAARE ORDERS DEKHO — ADMIN ONLY
// GET /api/orders
// ============================================================
exports.getAllOrders = async (req, res) => {
    try {
        // Admin ke liye ek shared cache
        const cached = await redisClient.get('all_orders');
        if (cached) {
            console.log('⚡ All orders served from Redis');
            return res.status(200).json({ success: true, orders: JSON.parse(cached) });
        }

        const orders = await Order.find({})
            .populate('buyer', 'name email')
            .populate('items.product', 'name images price')
            .sort('-createdAt');

        await redisClient.setEx('all_orders', CACHE_TTL, JSON.stringify(orders));
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch all orders." });
    }
};

// ============================================================
// 5. EK ORDER KI DETAIL
// GET /api/orders/:id
// ============================================================
exports.getOrderById = async (req, res) => {
    try {
        const cacheKey = `order:${req.params.id}`;

        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json({ success: true, order: JSON.parse(cached) });
        }

        const order = await Order.findById(req.params.id)
            .populate('buyer', 'name email')
            .populate('items.product', 'name images price');

        if (!order)
            return res.status(404).json({ message: "Order not found." });

        // Sirf apna order dekh sakta hai — admin ke alawa
        if (order.buyer._id.toString() !== req.user.id && req.user.role !== 'admin')
            return res.status(403).json({ message: "You are not authorized to view this order." });

        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(order));
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch order details." });
    }
};

// ============================================================
// 6. ORDER STATUS UPDATE KARO — SELLER + ADMIN
// PUT /api/orders/:id/status
// ============================================================
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order)
            return res.status(404).json({ message: "Order not found." });

        const userId = req.user.id.toString();
        const userRole = req.user.role;

        // Admin sab update kar sakta hai
        // Seller sirf woh orders update kar sakta hai jisme uske products hain
        if (userRole !== 'admin') {
            const isSellerOfOrder = order.items.some(
                item => item.seller?.toString() === userId
            );
            if (!isSellerOfOrder)
                return res.status(403).json({
                    message: "You are not authorized to update this order."
                });
        }

        const newStatus = req.body.status;
        if (!newStatus)
            return res.status(400).json({ message: "Order status is required." });

        // Lowercase normalize karo — "Processing", "SHIPPED" sab same ho jaye
        const normalized = newStatus.toLowerCase();
        const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(normalized))
            return res.status(400).json({
                message: `Invalid status. Allowed values: ${validStatuses.join(', ')}.`
            });

        order.orderStatus = normalized;

        // Delivered pe payment bhi complete mark karo
        if (normalized === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            order.paymentStatus = 'Completed';
        }

        // Cancel pe payment bhi cancel mark karo
        if (normalized === 'cancelled') {
            order.paymentStatus = 'Cancelled';
        }

        const updatedOrder = await order.save();

        // Status change hua — sab related caches stale ho gaye — clear karo
        await redisClient.del(`order:${req.params.id}`);
        await redisClient.del(`my_orders:${order.buyer.toString()}`);
        await redisClient.del('all_orders');
        await redisClient.del(`seller_orders:${userId}`);

        res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error("Order Status Update Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to update order status." });
    }
};

// ============================================================
// 7. SELLER KE ORDERS
// GET /api/orders/seller/dashboard
// ============================================================
exports.getSellerOrders = async (req, res) => {
    try {
        // Seller ka personal orders cache
        const cacheKey = `seller_orders:${req.user.id}`;

        const cached = await redisClient.get(cacheKey);
        if (cached) {
            console.log(`⚡ Seller orders served from Redis`);
            return res.status(200).json({ success: true, orders: JSON.parse(cached) });
        }

        // items.seller field se filter — sirf is seller ke products wale orders
        const orders = await Order.find({ "items.seller": req.user.id })
            .populate('buyer', 'name email')
            .populate('items.product', 'name images price')
            .sort('-createdAt');

        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(orders));
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch seller orders." });
    }
};

// ============================================================
// HELPER: Order Confirmation Email
// Async bhejo — main response slow nahi hoga
// ============================================================
const sendConfirmationEmail = (toEmail, order, shippingAddress, totalAmount) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        transporter.sendMail({
            from: `"TRIREME KIDS" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `Order Confirmed! #${order._id}`,
            html: `
                <div style="font-family:Arial;padding:30px;border:1px solid #eee;border-radius:12px;max-width:600px;margin:0 auto">
                    <h2 style="color:#ff4d6d;text-align:center">Your order has been placed! 🎉</h2>
                    <hr style="border-color:#eee" />
                    <p><b>Order ID:</b> #${order._id}</p>
                    <p><b>Delivery Address:</b> ${shippingAddress}</p>
                    <p><b>Payment Method:</b> ${order.paymentMethod}</p>
                    <hr style="border-color:#eee" />
                    <h3>Total Amount: <span style="color:#ff4d6d">Rs.${totalAmount}</span></h3>
                    <p style="color:#666">Your order will be shipped soon! 🚀</p>
                    <p style="font-size:12px;color:#aaa;text-align:center;margin-top:30px">TRIREME KIDS | Happy Shopping!</p>
                </div>
            `
        }).catch(err => console.log("Email Error:", err.message));
    } catch (err) {
        console.log("Email Setup Error:", err.message);
    }
};







// ============================================================
// VERIFY PAYMENT SIGNATURE
// POST /api/orders/verify-payment
// ============================================================

exports.verifyPayment = async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            shippingAddress
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");


        if (expectedSignature !== razorpay_signature) {

            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });

        }


        // NOW CREATE ORDER AFTER PAYMENT SUCCESS

        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            seller: item.product.seller,
            quantity: item.quantity,
            price: item.product.price
        }));

        const totalAmount = orderItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );


        const order = await Order.create({

            buyer: userId,

            items: orderItems,

            shippingAddress,

            totalAmount,

            paymentMethod: "Online",

            paymentStatus: "Completed",

            razorpayOrderId: razorpay_order_id,

            razorpayPaymentId: razorpay_payment_id

        });


        // clear cart

        cart.items = [];
        await cart.save();


        res.json({
            success: true,
            order
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
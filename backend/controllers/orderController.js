const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount) return res.status(400).json({ message: "Amount required!" });
        const razorOrder = await razorpay.orders.create({ amount: Math.round(amount * 100), currency: "INR", receipt: `receipt_${Date.now()}` });
        res.status(200).json({ success: true, razorOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shippingAddress, paymentMethod, paymentStatus } = req.body;
        if (!shippingAddress) return res.status(400).json({ message: "Shipping address required!" });
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart khali hai!" });
        const orderItems = cart.items.map(item => ({ product: item.product._id, seller: item.product.seller, quantity: item.quantity, price: item.product.price }));
        const totalAmount = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const order = await Order.create({ buyer: userId, items: orderItems, shippingAddress, totalAmount, paymentMethod: paymentMethod || 'COD', paymentStatus: paymentStatus || 'pending' });
        cart.items = [];
        await cart.save();
        sendConfirmationEmail(req.user.email, order, shippingAddress, totalAmount);
        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.id }).populate('items.product', 'name images price').sort('-createdAt');
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('buyer', 'name email').populate('items.product', 'name images price').sort('-createdAt');
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('buyer', 'name email').populate('items.product', 'name images price');
        if (!order) return res.status(404).json({ message: "Order nahi mila!" });
        if (order.buyer._id.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: "Access denied!" });
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ FIXED: Seller authorization + case-insensitive status
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        // DEBUG - remove after fix
        console.log("=== DEBUG ===");
        console.log("req.user.id:", req.user.id);
        console.log("req.user.role:", req.user.role);
        console.log("order.items sellers:", order.items.map(i => i.seller?.toString()));
        console.log("=============");
        if (!order) return res.status(404).json({ message: "Order nahi mila!" });

        const userId = req.user.id.toString();
        const userRole = req.user.role;

        // Admin sab update kar sakta hai, seller sirf apne orders
        if (userRole !== 'admin') {
            const isSellerOfOrder = order.items.some(
                item => item.seller?.toString() === userId
            );
            if (!isSellerOfOrder) {
                return res.status(403).json({ message: "Permission denied! Ye order tumhare products ka nahi hai." });
            }
        }

        const newStatus = req.body.status;
        if (!newStatus) return res.status(400).json({ message: "Status required!" });

        // Normalize to lowercase: "Processing", "SHIPPED" → "processing", "shipped"
        const normalized = newStatus.toLowerCase();
        const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(normalized)) {
            return res.status(400).json({ message: `Invalid status. Valid: ${validStatuses.join(', ')}` });
        }

        order.orderStatus = normalized;

        if (normalized === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            order.paymentStatus = 'Completed';
        }
        if (normalized === 'cancelled') {
            order.paymentStatus = 'Cancelled';
        }

        const updatedOrder = await order.save();
        res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error("Status Update Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ "items.seller": req.user.id }).populate('buyer', 'name email').populate('items.product', 'name images price').sort('-createdAt');
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const sendConfirmationEmail = (toEmail, order, shippingAddress, totalAmount) => {
    try {
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
        transporter.sendMail({
            from: `"TRIREME KIDS" <${process.env.EMAIL_USER}>`, to: toEmail,
            subject: `Order Confirmed! #${order._id}`,
            html: `<div style="font-family:Arial;padding:30px;border:1px solid #eee;border-radius:12px;max-width:600px;margin:0 auto"><h2 style="color:#ff4d6d;text-align:center">Order Place Ho Gaya!</h2><p><b>Order ID:</b> #${order._id}</p><p><b>Address:</b> ${shippingAddress}</p><p><b>Payment:</b> ${order.paymentMethod}</p><h3>Total: <span style="color:#ff4d6d">Rs.${totalAmount}</span></h3></div>`
        }).catch(err => console.log("Email Error:", err.message));
    } catch (err) { console.log("Email setup error:", err.message); }
};
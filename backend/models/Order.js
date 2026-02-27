const mongoose = require('mongoose');

// models/Order.js
const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Filter isi se hoga
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    shippingAddress: { type: String, required: true }, // 🔥 Yeh add karein
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: 'pending' },
    orderStatus: { type: String, default: 'processing' },
    // models/Order.js mein ye field zaroor honi chahiye
    shippingAddress: {
        type: String,
        required: true
    },
}, { timestamps: true });



module.exports = mongoose.model('Order', orderSchema);



const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],

    shippingAddress: {
        type: String,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    paymentStatus: {
        type: String,
        default: 'pending'
    },

    paymentMethod: {
        type: String
    },

    razorpayOrderId: {
        type: String
    },

    razorpayPaymentId: {
        type: String
    },

    orderStatus: {
        type: String,
        default: 'processing'
    }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
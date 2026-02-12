const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storeName: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    logo: {
        type: String,
        default: "" // Yahan hum "/uploads/123-logo.png" jaisa path save karenge
    },
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);
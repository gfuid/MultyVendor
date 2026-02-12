const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isSeller: { type: Boolean, default: false },
    sellerStatus: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none'
    },
    // Link to the Store model once it's created
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
/**
 * PRODUCT MODEL (The Marketplace Inventory Engine)
 * Purpose: Defines the structure for items listed by vendors.
 * It connects physical stock logic with cloud-hosted visual assets.
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // 1. RELATIONSHIP: Ownership mapping
    // References the 'User' model. This allows us to use .populate('seller') 
    // to fetch the vendor's name or store details in a single query.
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "A product must belong to a seller"]
    },

    // 2. CORE INFORMATION: Customer-facing details
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Product description is required"]
    },

    // 3. PRICING & CATEGORIZATION
    // Stored as a Number to allow for mathematical operations (discounts, taxes).
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be a negative value"]
    },
    category: {
        type: String,
        required: [true, "Category is essential for filtering and search"]
    },

    // 4. VISUAL ASSETS: Cloudinary Integration
    // An array of strings to store multiple secure HTTPS URLs from Cloudinary.
    // This supports a gallery view for the product on the frontend.
    images: [{
        type: String
    }],

    // 5. INVENTORY MANAGEMENT
    // Tracks availability. A '0' value can be used to trigger 'Out of Stock' UI.
    stock: {
        type: Number,
        default: 0,
        min: [0, "Stock level cannot fall below zero"]
    },

}, {
    // Adds 'createdAt' (useful for "New Arrivals" sorting)
    // and 'updatedAt' (useful for tracking price/stock changes).
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
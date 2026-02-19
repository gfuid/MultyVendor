/**
 * STORE MODEL (The Vendor Business Entity)
 * Purpose: Represents the physical and digital identity of a seller's business.
 * It links the business data to the User (Owner) model.
 */

const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    // 1. OWNERSHIP: Links the store to a specific User
    // 'ref: User' enables Mongoose population to fetch owner details easily.
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // 2. BRANDING: The public-facing identity of the shop
    storeName: {
        type: String,
        required: [true, "Store name is mandatory"],
        unique: true, // Ensures no two vendors share the exact same store name
        trim: true
    },

    // 3. CONTACT & LOGISTICS: Essential for order fulfillment and communication
    phone: {
        type: String,
        required: [true, "Contact number is required for verification"]
    },
    address: {
        type: String,
        required: [true, "Business address is required for logistics"]
    },

    // 4. MODERATION: Control layer for the Marketplace Admin
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending' // Every new store application starts as 'pending'
    },

    // 5. ASSETS: Store branding (Logo)
    // IMPORTANT: Since we use Cloudinary, this stores the secure HTTPS URL.
    logo: {
        type: String,
        default: ""
    },

}, {
    // Automatically creates 'createdAt' (Application Date) 
    // and 'updatedAt' (Last Modification Date)
    timestamps: true
});

module.exports = mongoose.model('Store', storeSchema);
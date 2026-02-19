/**
 * USER MODEL (The Identity & Access Engine)
 * Purpose: Manages user accounts, authentication credentials, 
 * and defines the permissions for Admins and Sellers.
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // 1. BASIC IDENTITY: Core information for every registered user
    name: {
        type: String,
        required: [true, "Please provide your full name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email address is mandatory"],
        unique: true, // Prevents duplicate accounts
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required for account security"]
    },

    // 2. AUTHORIZATION: Defines the user's privilege level in the system
    role: {
        type: String,
        enum: ['user', 'admin'], // Restricts values to these two options
        default: 'user'
    },

    // 3. MULTI-VENDOR LOGIC: Tracks if a user has transitioned into a vendor
    isSeller: {
        type: Boolean,
        default: false // Set to true only after Admin approval
    },
    sellerStatus: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none' // 'none' for regular buyers, 'pending' for new applicants
    },

    // 4. RELATIONSHIP: Link to the specific business details
    // Using ObjectId with 'ref' allows us to use .populate() to get Store info
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },

    // 5. SECURITY: Fields for the Forgot/Reset Password flow
    resetPasswordToken: String,
    resetPasswordExpire: Date

}, {
    // Automatically creates 'createdAt' and 'updatedAt' fields
    // Useful for tracking account age and the last profile update
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
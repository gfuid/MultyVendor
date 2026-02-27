const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    // 1. OWNERSHIP
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // 2. BASIC BUSINESS PROFILE (Frontend: FormBusinessInfo)
    businessInfo: {
        storeName: {
            type: String,
            required: [true, "Store name is mandatory"],
            unique: true,
            trim: true
        },
        category: {
            type: String,
            required: [true, "Business category is required"],
            enum: ['pharmacy', 'fashion', 'electronics', 'grocery']
        },
        description: {
            type: String,
            required: [true, "Store description is required"],
            maxLength: [200, "Description cannot exceed 200 characters"]
        },
        supportEmail: {
            type: String,
            required: [true, "Customer support email is required"]
        },
        experience: {
            type: Number,
            required: [true, "Years of experience is required"]
        },
        logo: {
            type: String, // Cloudinary URL
            required: [true, "Official Store Logo is required"]
        }
    },

    // 3. COMPLIANCE & LEGAL (Frontend: FormLegal & Image 6)
    legalInfo: {
        taxId: { type: String, required: [true, "GSTIN Number is required"] },
        panCard: { type: String, required: [true, "PAN Card is required"] },
        drugLicenseGeneral: { type: String, required: [true, "General Drug License is required"] },

        // This part handles Image 6 (Pharmacy Specific)
        pharmacySpecific: {
            licenseNumber: { type: String }, // Form 20/21 No.
            licenseProof: { type: String }    // URL of uploaded PDF/Image
        }
    },

    // 4. BANKING & LOGISTICS (Frontend: FormBanking)
    bankingInfo: {
        accountHolderName: { type: String, required: true },
        bankName: { type: String, required: true },
        branchName: { type: String, required: true },
        bankAccount: { type: String, required: true },
        accountType: {
            type: String,
            enum: ['savings', 'current'],
            required: true
        },
        ifscCode: { type: String, required: true },
        phone: { type: String, required: true }, // Business Contact
        pickupAddress: { type: String, required: true } // Warehouse Location
    },

    // 5. MODERATION STATUS
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    isVerified: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Store', storeSchema);
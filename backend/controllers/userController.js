const User = require('../models/User');

/**
 * ============================================================
 * GET CURRENT USER PROFILE (Apni Pehchan)
 * ============================================================
 * @desc    Logged-in user ka data nikalna token ke zariye
 * @route   GET /api/users/me
 * @access  Private (Token Required)
 * * Deep Meaning: Yeh function frontend ko batata hai ki user ka role kya hai, 
 * taki dashboard (Admin/Seller/User) sahi se render ho sake.
 */
const getMe = async (req, res) => {
    try {
        // MIDDLEWARE RELIANCE: req.user humein 'protect' middleware se milta hai.
        // .select('-password') ensure karta hai ki security ke liye hash password kabhi leak na ho.
        const user = await User.findById(req.user.id).select('-password');

        // VALIDATION: Check karein ki user abhi bhi database mein exist karta hai ya nahi.
        if (user) {
            // SUCCESS RESPONSE: Sirf wahi fields bhejna jo UI display ke liye zaroori hain.
            res.status(200).json({
                success: true,
                user: {
                    _id: user._id,           // Unique Identification
                    name: user.name,         // UI par dikhane ke liye
                    email: user.email,       // Account reference
                    role: user.role,         // Authorization (Admin/User)
                    isSeller: user.isSeller, // Vendor status flag
                    sellerStatus: user.sellerStatus, // Approval status (Pending/Approved)
                    logo: user.logo || ""    // Shop/User ka profile picture
                }
            });
        } else {
            // Error handling agar ID invalid ho chuki hai
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        // CATCH BLOCK: Database failure ya server crash handle karne ke liye
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMe };
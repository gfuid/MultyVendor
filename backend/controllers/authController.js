const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Ensure crypto is imported

/**
 * @desc    JWT Token Generate karne ka Helper Function
 * @param   {string} id - User ki MongoDB Unique ID (_id)
 * @returns {string} - Signed JWT Token jo frontend ko bheja jayega
 */
const generateToken = (id) => {
    // jwt.sign() method naya token create karta hai
    return jwt.sign(
        { id }, // Payload: Isme user ki ID chhupi hoti hai (Secretly encoded)

        process.env.JWT_SECRET, // Secret Key: Jo humne .env file mein rakhi hai (Iske bina token verify nahi ho sakta)

        {
            expiresIn: '30d' // Expiry: Yeh token 30 din tak valid rahega, uske baad user ko fir se login karna padega
        }
    );
};

/**
 * @desc    Naya User Register karna aur Seller banne ki request handle karna
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
    try {
        // Frontend se data destructure kar rahe hain
        const { name, email, password, wantToBeSeller } = req.body;

        // 1. DATABASE VALIDATION: Pehle check karo email pehle se exist toh nahi karta
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // 2. PASSWORD SECURITY: Bcrypt use karke password ko hash (encrypt) kar rahe hain
        // Salt ek random string hoti hai jo hashing ko aur secure banati hai
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. MULTI-VENDOR LOGIC: Naya User create kar rahe hain
        // Agar user ne 'Become a Seller' checkbox tick kiya hai toh status 'pending' rakhenge
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            // Marketplace status check: Admin ise baad mein approve karega
            sellerStatus: 'none',
            isSeller: false
        });

        // 4. RESPONSE: User create hone ke baad data aur JWT Token bhej rahe hain
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // Default 'user' role milega model se
                sellerStatus: user.sellerStatus,
                // Token generate helper function yahan use ho raha hai
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        // Server level error handling
        res.status(500).json({ message: error.message });
    }
};


// login users
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. INPUT VALIDATION: Check karein dono fields hain ya nahi
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide both email and password' });
        }

        // 2. DATABASE USER SEARCH: Email se user dhundein aur password select karein
        // Ab yahan Admin, Seller aur User sab database se hi check honge
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // 3. PASSWORD VERIFICATION: Bcrypt se hash compare karein
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // 4. TOKEN GENERATION: Database ki real ID aur real role use karein
        const token = generateToken(user._id, user.role);

        // 5. SUCCESS RESPONSE: User data bhejien
        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // "admin", "user", ya "seller"
                isSeller: user.isSeller,
                sellerStatus: user.sellerStatus,
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
};
/**
 * @desc    Password reset karne ke liye token generate karna aur link bhejnat
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
    try {
        // 1. USER CHECK: Email ke zariye database mein user ko dhundna
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: "email not found" });
        }

        // 2. TOKEN GENERATION: Ek random 20-byte ka string (hex format mein) generate karna
        // Yeh token user ko link ke zariye bheja jayega
        const resetToken = crypto.randomBytes(20).toString('hex');

        // 3. TOKEN HASHING: Security ke liye original token DB mein save nahi karte
        // Use SHA-256 algorithm se hash karke database mein store karte hain
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // 4. EXPIRY SET KARNA: Reset link sirf 10 minutes ke liye valid rahega
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        // Database mein hashed token aur expiry save karein
        await user.save();

        // 5. DYNAMIC REDIRECTION LOGIC: .env se URLs pick karna
        // Agar role 'admin' hai toh Admin Panel ka link, warna Main Frontend ka link
        const baseUrl = user.role === 'admin'
            ? process.env.ADMIN_FRONTEND_URL
            : process.env.FRONTEND_URL;

        // Reset URL taiyar karein (Original 'resetToken' ke saath)
        const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

        // 6. SUCCESS RESPONSE: Filhal hum URL response mein bhej rahe hain
        // Production mein yahan 'Nodemailer' use karke email bhejna hoga
        res.status(200).json({
            success: true,
            message: " Password reset link generated ",
            resetUrl // Yeh development phase mein testing ke liye bhej rahe hain
        });

    } catch (error) {
        // Error handling
        res.status(500).json({ message: error.message });
    }
};



/**
 * @desc    Token ka use karke password reset karna
 * @route   PUT /api/auth/resetpassword/:resettoken
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
    try {
        // 1. TOKEN DECRYPTION: Frontend se aaye huye raw token ko hash karna
        // Kyunki humne database mein hashed token save kiya tha, isliye comparison ke liye ise bhi hash karna padega
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        // 2. USER VERIFICATION: Database mein hashed token aur expiry check karna
        // '$gt: Date.now()' ka matlab hai ki token abhi expire nahi hua hona chahiye
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        // 3. VALIDATION: Agar user nahi mila ya token purana hai
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // 4. PASSWORD SECURITY: Naye password ko hash karke save karna
        // Password ko plain text mein save karna security risk hota hai
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        // 5. CLEANUP: Reset token fields ko remove karna
        // Taki ek hi token se baar-baar password change na kiya ja sake
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // User data ko update karna
        await user.save();

        // 6. SUCCESS RESPONSE: User ko inform karna ki password badal gaya hai
        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });

    } catch (error) {
        // Kisi bhi error ki soorat mein response bhejnat
        res.status(500).json({ message: error.message });
    }
};
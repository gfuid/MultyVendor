const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user & handle seller intent
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, wantToBeSeller } = req.body;

        // 1. Validation: Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // 2. Security: Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Multi-Vendor Logic: Set seller status if checkbox was ticked
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            sellerStatus: wantToBeSeller ? 'pending' : 'none',
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                sellerStatus: user.sellerStatus,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// backend/controllers/authController.js

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation check
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password'
            });
        }

        // 2. Find User and explicitly select password (if using select: false in model)
        const user = await User.findOne({ email });

        if (!user) {
            // Big Industry standard: Don't tell if email is wrong or password
            // to prevent account enumeration
            return res.status(401).json({
                success: false,
                message: 'user not there'
            });
        }

        // 3. Password Verification
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'wrong password'
            });
        }

        // 4. Send Response
        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isSeller: user.isSeller,
                sellerStatus: user.sellerStatus,
            },
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            message: 'Server error, please try again later'
        });
    }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        // req.user humein 'protect' middleware se milta hai
        const user = await User.findById(req.user.id);

        if (user) {
            res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isSeller: user.isSeller,
                    sellerStatus: user.sellerStatus,
                    logo: user.logo || "" // Agar user ka apna logo hai toh
                }
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
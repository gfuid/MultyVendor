// backend/controllers/productController.js
const Product = require('../models/Product');

// Sabse pehle ye function
exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Please upload at least one image" });
        }
        const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
        const product = await Product.create({
            seller: req.user.id,
            name,
            description,
            price,
            category,
            stock,
            images: imagePaths
        });
        res.status(201).json({ success: true, message: "Product added!", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Phir ye function
exports.getVendorProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user.id });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
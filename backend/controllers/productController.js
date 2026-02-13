// backend/controllers/productController.js
const Product = require('../models/Product');
const fs = require('fs');
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


exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Security check
        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Physical images delete karein
        product.images.forEach(imagePath => {
            const fullPath = `.${imagePath}`;
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        });

        await product.deleteOne();
        res.status(200).json({ success: true, message: "Product Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
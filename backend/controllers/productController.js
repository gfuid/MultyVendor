// backend/controllers/productController.js
const Product = require('../models/Product');
const fs = require('fs');
// Sabse pehle ye function
// backend/controllers/productController.js
exports.addProduct = async (req, res) => {
    try {
        // 1. Check karein ki files upload hui hain ya nahi
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Kam se kam ek image dalo bhai!" });
        }

        // 2. Cloudinary URLs ko extract karein
        const imagePaths = req.files.map(file => file.path);

        // 3. Product create karein (Data types ensure karein)
        const productData = {
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price), // Number mein convert karna best practice hai
            category: req.body.category,
            stock: Number(req.body.stock), // Number mein convert karein
            seller: req.user.id,
            images: imagePaths // DB mein Cloudinary URLs store ho rahe hain
        };

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            message: "Product added to Cloudinary & DB!",
            product
        });
    } catch (error) {
        // Log zaroor check karein agar Cloudinary upload fail ho
        console.error("Upload Error Details:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: Product add nahi ho paya",
            error: error.message
        });
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


// Ensure karein ki 'exports.' ke saath likha hai
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product nahi mila" });

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
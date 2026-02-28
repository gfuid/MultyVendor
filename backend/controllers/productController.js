// ============================================================
// productController.js — Redis Caching ke saath
// Har function mein pehle Redis check hota hai, phir MongoDB
// ============================================================
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const { redisClient } = require('../config/redis');
// Cache kitni der tak rahegi — 5 minute
const CACHE_TTL = 300;

// ============================================================
// 1. NAYA PRODUCT ADD KARO
// POST /api/products
// ============================================================
exports.addProduct = async (req, res) => {
    try {
        // Bina image ke product nahi banega
        if (!req.files || req.files.length === 0)
            return res.status(400).json({ message: "At least one product image is required." });

        // Cloudinary se image URLs nikalo
        const imagePaths = req.files.map(file => file.path);

        // MongoDB mein product save karo
        const product = await Product.create({
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            stock: Number(req.body.stock),
            seller: req.user.id, // Auth middleware se seller ID milti hai
            images: imagePaths
        });

        // Naya product aaya toh purana cache stale ho gaya — delete karo
        await redisClient.del('all_products');
        await redisClient.del(`seller_products:${req.user.id}`);

        res.status(201).json({
            success: true,
            message: "Product added successfully.",
            product
        });
    } catch (error) {
        console.error("Product Upload Error:", error);
        res.status(500).json({ success: false, message: "Failed to add product. Please try again." });
    }
};

// ============================================================
// 2. SAARE PRODUCTS FETCH KARO (Public)
// GET /api/products
// ============================================================
exports.getAllProducts = async (req, res) => {
    try {
        // Pehle Redis mein dhundo — agar mila toh database hit karne ki zaroorat nahi
        const cached = await redisClient.get('all_products');
        if (cached) {
            console.log('⚡ Serving All Products from Redis');
            return res.status(200).json(JSON.parse(cached));
        }

        // Redis mein nahi mila toh MongoDB se lo
        const products = await Product.find({}).populate('seller', 'businessInfo.storeName');

        // Agla baar ke liye Redis mein store karo
        await redisClient.setEx('all_products', CACHE_TTL, JSON.stringify(products));

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products. Please try again." });
    }
};

// ============================================================
// 3. EK PRODUCT KI DETAIL (ID se)
// GET /api/products/:id
// ============================================================
exports.getProductById = async (req, res) => {
    try {
        // Har product ka alag cache key — taaki individual update possible ho
        const cacheKey = `product:${req.params.id}`;

        const cached = await redisClient.get(cacheKey);
        if (cached) {
            console.log(`⚡ Product ${req.params.id} served from Redis`);
            return res.status(200).json(JSON.parse(cached));
        }

        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found." });

        // Cache mein daal do agla request ke liye
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(product));

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch product details." });
    }
};

// ============================================================
// 4. SELLER KE APNE PRODUCTS
// GET /api/products/vendor
// ============================================================
exports.getVendorProducts = async (req, res) => {
    try {
        // Seller ka personal cache — sirf unke products
        const cacheKey = `seller_products:${req.user.id}`;

        const cached = await redisClient.get(cacheKey);
        if (cached) {
            console.log(`⚡ Seller products served from Redis`);
            return res.status(200).json(JSON.parse(cached));
        }

        // Database se seller ki ID match karke products lo
        const products = await Product.find({ seller: req.user.id });
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(products));

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch your products." });
    }
};

// ============================================================
// 5. PRODUCT UPDATE KARO
// PUT /api/products/:id
// ============================================================
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        // Product exist karta hai ya nahi
        if (!product)
            return res.status(404).json({ message: "Product not found." });

        // Sirf apna product update kar sakta hai seller
        if (product.seller.toString() !== req.user.id)
            return res.status(403).json({ message: "You are not authorized to update this product." });

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Product badla toh teeno related caches hata do
        await redisClient.del(`product:${req.params.id}`);
        await redisClient.del('all_products');
        await redisClient.del(`seller_products:${req.user.id}`);

        res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Failed to update product." });
    }
};

// ============================================================
// 6. PRODUCT DELETE KARO
// DELETE /api/products/:id
// ============================================================
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product)
            return res.status(404).json({ message: "Product not found." });

        // Ownership check — dusre ka product delete nahi kar sakte
        if (product.seller.toString() !== req.user.id)
            return res.status(403).json({ message: "You are not authorized to delete this product." });

        // Cloudinary se bhi images hata do — storage waste na ho
        const deletePromises = product.images.map(url => {
            const publicId = url.split('/').pop().split('.')[0];
            return cloudinary.uploader.destroy(publicId);
        });
        await Promise.all(deletePromises);
        await product.deleteOne();

        // Database se hata diya toh cache bhi stale hai — clear karo
        await redisClient.del(`product:${req.params.id}`);
        await redisClient.del('all_products');
        await redisClient.del(`seller_products:${req.user.id}`);

        res.status(200).json({ success: true, message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete product." });
    }
};
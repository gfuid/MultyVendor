const Product = require('../models/Product');
const fs = require('fs');

/**
 * ============================================================
 * 1. ADD NEW PRODUCT (Naya Maal List Karein)
 * ============================================================
 * @desc    Cloudinary par images upload karke DB mein entry karna
 * @access  Private (Sirf Seller/Vendor ke liye)
 */
exports.addProduct = async (req, res) => {
    try {
        // IMAGE VALIDATION: Business logic - Bina photo ke product nahi bikta!
        // req.files tab aata hai jab uploadMiddleware.array() use hota hai
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Kam se kam ek image dalo bhai!" });
        }

        // CLOUDINARY EXTRACTION: Multer-Cloudinary storage se milne wale secure URLs nikalna
        // imagePaths mein array of strings (URLs) store honge
        const imagePaths = req.files.map(file => file.path);

        // DATA CLEANING: Frontend se string aata hai, use calculation ke liye Number mein badalna zaroori hai
        const productData = {
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            stock: Number(req.body.stock),
            seller: req.user.id, // Auth middleware se mili hui Seller ID
            images: imagePaths
        };

        // DB SAVING: Product ko database mein finalize karna
        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            message: "Mubarak ho! Product Cloudinary aur DB mein add ho gaya.",
            product
        });
    } catch (error) {
        // ERROR LOGGING: Server logs check karne ke liye detailed message
        console.error("Upload Error Details:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: Product add nahi ho paya",
            error: error.message
        });
    }
};

/**
 * ============================================================
 * 2. GET VENDOR PRODUCTS (Seller ka Apna Stock)
 * ============================================================
 * @desc    Sirf logged-in seller ke products fetch karna
 */
exports.getVendorProducts = async (req, res) => {
    try {
        // FILTER LOGIC: MongoDB search query jo sirf logged-in user ki ID match kare
        const products = await Product.find({ seller: req.user.id });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ============================================================
 * 3. DELETE PRODUCT (Stock se Maal Hatayein)
 * ============================================================
 * @desc    Database entry aur (Local/Cloud) images ko clean karna
 */
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product nahi mila" });

        // OWNERSHIP SECURITY: Ek seller dusre seller ka maal delete na kar sake!
        // toString() zaroori hai kyunki product.seller ek ObjectId hota hai
        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ message: "Aap dusre ka product delete nahi kar sakte!" });
        }

        // FILE CLEANUP: Agar local storage use kar rahe hain, toh storage khali karein
        // Note: Agar Cloudinary hai, toh cloudinary.uploader.destroy() call karna chahiye
        product.images.forEach(imagePath => {
            const fullPath = `.${imagePath}`;
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        });

        await product.deleteOne();
        res.status(200).json({ success: true, message: "Product Market se hata diya gaya hai." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ============================================================
 * 4. GET PRODUCT BY ID (Detail View)
 * ============================================================
 * @desc    Kisi ek specific product ki poori detail nikalna
 */
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product missing hai" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ============================================================
 * 5. UPDATE PRODUCT (Details Edit Karein)
 * ============================================================
 * @desc    Price, Stock ya Description mein badlav karna
 */
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product nahi mila" });

        // ATOMIC UPDATE: runValidators ensure karta hai ki naya data model rules follow kare
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
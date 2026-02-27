// backend/controllers/cartController.js
const Cart = require('../models/Cart');

// @desc    Add product to cart
// @route   POST /api/cart/add
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Protect middleware se milega

    try {
        let cart = await Cart.findOne({ user: userId });

        if (cart) {
            // Check karein agar product pehle se cart mein hai
            const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

            if (itemIndex > -1) {
                // Quantity badha dein
                cart.items[itemIndex].quantity += (quantity || 1);
            } else {
                // Naya item add karein
                cart.items.push({ product: productId, quantity: quantity || 1 });
            }
            cart = await cart.save();
        } else {
            // Naya cart banayein
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity: quantity || 1 }]
            });
        }

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ message: "Cart error", error: error.message });
    }
};

// @desc    Get user cart items
// @route   GET /api/cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        res.status(200).json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// backend/controllers/cartController.js

// QUANTITY UPDATE & REMOVE LOGIC
// backend/controllers/cartController.js

exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity, action } = req.body;
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

        if (itemIndex > -1) {
            if (action === 'delete') {
                cart.items.splice(itemIndex, 1); // Item bilkul hata do
            } else {
                cart.items[itemIndex].quantity = quantity; // Quantity set karo
            }
            await cart.save();
            // Pura updated cart wapas bhejien taaki frontend sync ho jaye
            const updatedCart = await Cart.findOne({ user: req.user.id }).populate('items.product');
            return res.status(200).json({ success: true, cart: updatedCart });
        }
        res.status(404).json({ message: "Item are not in cart" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
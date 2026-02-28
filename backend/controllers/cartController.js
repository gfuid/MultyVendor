// ============================================================
// cartController.js — Redis Caching ke saath
// Cart data baar baar fetch hota hai — Redis se speed milti hai
// ============================================================
const Cart = require('../models/Cart');
const { redisClient } = require('../config/redis');

// Cart jaldi change hoti hai isliye sirf 2 minute ka cache
const CACHE_TTL = 120;

// ── Helper: Cart ka cache hata do jab bhi kuch badlega ────────
const invalidateCartCache = async (userId) => {
    await redisClient.del(`cart:${userId}`);
};

// ============================================================
// 1. CART DEKHO
// GET /api/cart
// ============================================================
exports.getCart = async (req, res) => {
    try {
        const cacheKey = `cart:${req.user.id}`;

        // Redis mein cart hai toh seedha bhejo — DB hit nahi
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            console.log(`⚡ Cart served from Redis`);
            return res.status(200).json(JSON.parse(cached));
        }

        // Nahi mila toh MongoDB se lo aur product details bhi populate karo
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        const response = cart || { items: [] };

        // Agla request fast hoga
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(response));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch cart." });
    }
};

// ============================================================
// 2. CART MEIN PRODUCT ADD KARO
// POST /api/cart/add
// ============================================================
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        // Pehle check karo cart exist karti hai ya nahi
        let cart = await Cart.findOne({ user: userId });

        if (cart) {
            // Agar product pehle se hai toh quantity badha do
            const itemIndex = cart.items.findIndex(
                p => p.product.toString() === productId
            );

            if (itemIndex > -1) {
                // Existing item — quantity increment
                cart.items[itemIndex].quantity += (quantity || 1);
            } else {
                // Naya item — array mein push karo
                cart.items.push({ product: productId, quantity: quantity || 1 });
            }
            await cart.save();
        } else {
            // Pehli baar cart bana raha hai user
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity: quantity || 1 }]
            });
        }

        // Cart badli toh cache stale hai — invalidate karo
        await invalidateCartCache(userId);

        // Fresh populated cart bhejo frontend ko
        const updatedCart = await Cart.findOne({ user: userId }).populate('items.product');
        res.status(200).json({ success: true, cart: updatedCart });
    } catch (error) {
        res.status(500).json({ message: "Failed to add item to cart." });
    }
};

// ============================================================
// 3. CART ITEM UPDATE YA REMOVE KARO
// PUT /api/cart/update
// ============================================================
exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity, action } = req.body;
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart)
            return res.status(404).json({ message: "Cart not found." });

        // Item index dhundo
        const itemIndex = cart.items.findIndex(
            p => p.product.toString() === productId
        );

        if (itemIndex > -1) {
            if (action === 'delete') {
                // Poora item hata do array se
                cart.items.splice(itemIndex, 1);
            } else {
                // Sirf quantity update karo
                cart.items[itemIndex].quantity = quantity;
            }
            await cart.save();

            // Cart badli — cache clear
            await invalidateCartCache(req.user.id);

            // Updated cart wapas bhejo taaki frontend sync ho jaye
            const updatedCart = await Cart.findOne({ user: req.user.id }).populate('items.product');
            return res.status(200).json({ success: true, cart: updatedCart });
        }

        res.status(404).json({ message: "Item not found in cart." });
    } catch (error) {
        res.status(500).json({ message: "Failed to update cart." });
    }
};
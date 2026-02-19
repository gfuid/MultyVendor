// 1. Sabse pehle Dotenv load karein
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// --- REDIS IMPORT (Yeh missing tha) ---
const { connectRedis } = require('./config/redis');

// 2. Routes aur baki imports
const vendorRoutes = require('./routes/vendorRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Admin routes import karein

const app = express();

// --- REDIS CONNECTION START ---
connectRedis();

// Middlewares
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_FRONTEND_URL],
    credentials: true
}));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected: Trireme Database Ready"))
    .catch((err) => console.log("❌ DB Connection Error:", err));

// API Routes
// server.js mein routes ke section mein
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vendor', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes); // Admin API enable karein

app.get('/', (req, res) => {
    res.send("Trireme Multi-Vendor API is Running with Redis...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log("Cloudinary Key Check:", process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing");
    console.log("Redis URL Check:", process.env.REDIS_URL ? "✅ Loaded" : "❌ Missing");
});
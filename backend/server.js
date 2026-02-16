// 1. Sabse pehle Dotenv load karein
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// 2. Routes aur baki imports
const vendorRoutes = require('./routes/vendorRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected: Trireme Database Ready"))
    .catch((err) => console.log("❌ DB Connection Error:", err));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vendor', vendorRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.send("Trireme Multi-Vendor API is Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    // Check karein ki ab key load ho rahi hai ya nahi
    console.log("Cloudinary Key Check:", process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing");
});
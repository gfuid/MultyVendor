const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const vendorRoutes = require('./routes/vendorRoutes');
const productRoutes = require('./routes/productRoutes');

// Load environment variables
dotenv.config();

const app = express();

// 1. Middlewares (Production Level Security)
app.use(express.json()); // To parse JSON bodies
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Connect to your Vite Frontend
app.use(helmet({
    crossOriginResourcePolicy: false, // Isse external/local images load ho payengi
}));
app.use(morgan('dev')); // Logging requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// 2. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected: Trireme Database Ready"))
    .catch((err) => console.log("❌ DB Connection Error:", err));

// 3. Basic Route for Testing
app.get('/', (req, res) => {
    res.send("Trireme Multi-Vendor API is Running...");
});



// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vendor', vendorRoutes);
app.use('/api/products', productRoutes);


// 4. Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
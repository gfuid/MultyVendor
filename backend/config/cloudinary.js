/**
 * CLOUDINARY CONFIGURATION & STORAGE LOGIC
 * Purpose: Images ko direct Cloudinary cloud par upload karna bina server space use kiye.
 */

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config(); // Environment variables (.env) load karne ke liye zaroori hai

// 1. CLOUDINARY SDK SETUP
// Yeh block aapke backend ko Cloudinary ke servers se authenticate (connect) karta hai.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,      // .env se API Key fetch kar raha hai
    api_secret: process.env.CLOUDINARY_API_SECRET // .env se Secret Key fetch kar raha hai
});

// 2. MULTER-STORAGE-CLOUDINARY ENGINE
// Yeh engine Multer ko batata hai ki file local 'uploads/' folder ke bajaye seedha cloud par bhejni hai.
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'trireme_products', // Cloudinary Dashboard mein isi naam ka folder banega

        // Security: Sirf wahi formats allow honge jo marketplace ke liye safe hain
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],

        // OPTIMIZATION: Upload hote hi image resize ho jayegi taaki frontend fast load ho
        // 'limit' ka matlab hai ki agar image choti hai toh use zabardasti bada nahi kiya jayega
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    },
});

/**
 * EXPORTS:
 * 'cloudinary' object useful hai jab humein manual delete (destroy) karna ho.
 * 'storage' object humara Multer middleware use karega.
 */
module.exports = { cloudinary, storage };
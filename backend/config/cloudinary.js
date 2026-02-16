// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Debugging ke liye: Server start hote hi check karein key mil rahi hai ya nahi
console.log("Cloudinary Key Check:", process.env.CLOUDINARY_API_KEY);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,    // Yeh line check karein
    api_secret: process.env.CLOUDINARY_API_SECRET // Yeh line check karein
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'trireme_products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

module.exports = { cloudinary, storage };
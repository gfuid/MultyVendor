/**
 * UPLOAD MIDDLEWARE (The Logistics Manager)
 * Purpose: Frontend se aane wali images ko validate karna aur Cloudinary storage tak pahunchana.
 */

const multer = require('multer');
const { storage } = require('../config/cloudinary'); // Destructure karke sirf storage engine nikalna

// 1. FILE FILTER (Security Check)
// Yeh function ensure karta hai ki koi malicious file (jaise .exe ya .js) upload na ho.
const fileFilter = (req, file, cb) => {
    // Check karein ki file ka type "image" se shuru hota hai ya nahi
    if (file.mimetype.startsWith('image')) {
        cb(null, true); // Sab sahi hai, aage badho
    } else {
        // Error throw karein agar file image nahi hai
        cb(new Error('only this format images (jpg, png, webp) allow '), false);
    }
};

// 2. MULTER CONFIGURATION
// Yeh main upload engine hai jo hum controllers mein use karenge.
const upload = multer({
    storage: storage, // Humara fixed Cloudinary storage engine

    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB Limit: Taaki server/cloud par faltu load na pade
    },

    fileFilter: fileFilter // Upar banaya gaya security filter
});

/**
 * EXPORT:
 * Ise routes mein use kiya jayega: upload.single('image') ya upload.array('images', 5)
 */
module.exports = upload;
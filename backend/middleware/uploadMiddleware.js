const multer = require('multer');
const path = require('path');

// Storage setting
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Is folder ko manually create kar lena backend root mein
    },
    filename: (req, file, cb) => {
        // Filename ko unique banana: current date + original name
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter (sirf images allow karne ke liye)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images (jpg, png, webp) are allowed!'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 2MB Limit
    fileFilter
});

module.exports = upload;
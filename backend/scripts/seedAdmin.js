// backend/scripts/seedAdmin.js
const mongoose = require('mongoose');
const User = require('../models/User'); // Path check kar lena
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        // 1. Database Connect karein
        await mongoose.connect(process.env.MONGO_URI);
        console.log("📡 Connecting to DB for seeding...");

        // 2. Check karein ki admin email pehle se toh nahi hai
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminExist = await User.findOne({ email: adminEmail });

        if (adminExist) {
            console.log("ℹ️ Admin already exists in Database. No action needed.");
            process.exit();
        }

        // 3. Password Hash karein
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

        // 4. Admin User Create karein
        await User.create({
            name: "Master Admin",
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            isSeller: false
        });

        console.log("✅ Dynamic Admin created successfully in DB!");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedAdmin();
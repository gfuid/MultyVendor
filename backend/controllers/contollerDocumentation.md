🎮 Backend Controllers Documentation
Yeh document humare marketplace ke main controllers ke logic aur unki zimmedariyon (responsibilities) ko explain karta hai.


1. 🔑 Auth Controller (authController.js)
Purpose: User registration, secure login, aur password recovery handle karna.

registerUser: Naya account create karta hai. Agar user "Become a Seller" tick karta hai, toh yeh unka sellerStatus default pending rakhta hai.

loginUser: Email aur password verify karke ek JWT Token generate karta hai. Humne security ke liye specific error messages ("Wrong Password") ke bajaye general messages use kiye hain.

forgotPassword & resetPassword: Yeh crypto ka use karke ek temporary secure token banata hai. Humne .env ka use karke dynamic links banaye hain taaki Admin aur User ko unke respective frontend dashboards par bheja ja sake.




2. 🛡️ Admin Controller (adminController.js)
Purpose: Marketplace ki "Power" handle karna aur system-wide monitoring.

getAllVendors: Saare sellers ki list dikhata hai. Speed badhane ke liye yeh Redis Caching use karta hai.

approveStore: Kisi pending vendor ko review karke use approved mark karta hai, jiske baad hi woh products bech sakta hai.

getAllProductsAdmin: Poore marketplace ke saare products ko ek hi jagah manage (view/delete) karne ke liye.

Cache Invalidation: Jab bhi Admin kisi vendor ko approve karta hai, yeh automatically Redis cache clear kar deta hai taaki data hamesha fresh rahe.




3. 📦 Product Controller (productController.js)
Purpose: Products ki Lifecycle (Create, Read, Update, Delete) manage karna.

addProduct: Cloudinary ka use karke multiple images upload karta hai aur unke secure URLs database mein save karta hai.

getVendorProducts: Sirf us seller ke products dikhata hai jo logged-in hai.

deleteProduct: Yeh sirf Product collection se entry nahi hatata, balki Cloudinary se images bhi remove karne ki capacity rakhta hai.

Security Check: Har function mein humne check lagaya hai ki ek seller sirf apne hi products ko edit ya delete kar sake.



🏪 4. Vendor/Store Controller (vendorController.js)
Purpose: Store ki identity aur settings manage karna.

applyForStore: Normal user se shop ki details (Logo, TaxID, Address) lekar application submit karta hai.

updateStoreSettings: Shop ka naam, description, ya contact info badalne ke liye.

Redis Integration: Store details fetch karte waqt yeh pehle Redis check karta hai, jisse shop page miliseconds mein load hota hai.

👤 5. User Controller (userController.js)
Purpose: User ki profile aur session handle karna.

getMe: Frontend har refresh par isi endpoint ko call karta hai taaki logged-in user ki state (Role, Name, Logo) bani rahe. Yeh password ko response se exclude (-password) karta hai security ke liye.

💡 Controllers Logic Summary
Controller,Database Impact,Cache Strategy
Auth,User Collection,No Cache (Security)
Admin,"User, Store, Product",Redis (30 min expiry)
Product,Product Collection,Partial Caching
Store,Store Collection,Key-based Caching
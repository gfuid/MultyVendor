🛠️ Backend Middleware Documentation
Yeh documentation humare multi-vendor marketplace ke core middlewares ke functionality aur unke "Deep Logic" ko explain karti hai.

1. 👮 Auth Middleware (authMiddleware.js)
Purpose: Application ki security, authentication aur role-based access control (RBAC) ko manage karna.

Functions:
protect:

Logic: Header se Bearer Token nikalta hai aur JWT_SECRET ka use karke use verify karta hai.

Deep Meaning: Agar token valid hai, toh yeh user ki ID nikaal kar database se user profile fetch karta hai aur use req.user mein attach kar deta hai. Iske bina koi bhi private route access nahi kiya ja sakta.

admin:

Logic: Sirf un users ko allow karta hai jinka role === 'admin'.

Deep Meaning: Yeh protect ke baad chalta hai. Yeh ensure karta hai ki vendors ko approve karne ya marketplace ko control karne ki power sirf Admin ke paas rahe.

2. 🏥 Error Middleware (errorMiddleware.js)
Purpose: Poore backend ke errors ko ek hi "Standard Format" mein handle karna taaki frontend crash na ho.

Functions:
errorHandler:

Logic: Jab bhi kisi controller mein error aata hai, yeh use catch karta hai.

Deep Meaning: Yeh environment check karta hai. Agar app Production mein hai, toh yeh "Stack Trace" (code ki internal details) chhupa deta hai, lekin Development mein yeh details dikhata hai taaki hum bugs fix kar sakein.

3. 📦 Upload Middleware (uploadMiddleware.js)
Purpose: Products aur Store ki images ko validate karna aur unhe Cloudinary Cloud par secure tareeke se store karna.

Functions:
upload (Multer + Cloudinary):

Logic: Yeh multer-storage-cloudinary ka use karta hai. File server ke disk par save hone ke bajaye seedha RAM ke raste Cloudinary ke servers par chali jati hai.

Deep Meaning: Yeh storage space bachata hai aur performance badhata hai. Isme fileFilter laga hai jo sirf jpg, png, aur webp formats allow karta hai, aur 5MB ki size limit enforce karta hai.

⚙️ How to Use (Implementation)
In middlewares ko hum routes mein chain ki tarah use karte hain:

JavaScript
// Example: Sirf Admin hi product delete kar sakta hai
router.delete('/:id', protect, admin, adminDeleteProduct);

// Example: Seller image upload kar sakta hai
router.post('/add', protect, upload.array('images', 5), addProduct);
🛣️ Backend API Routes Documentation
Yeh document Trireme Marketplace ki saari API endpoints aur unki security requirements ko detail mein explain karta hai.


🔐 Authentication Routes (/api/auth)
Purpose: User identity manage karna.

Method,Endpoint,Access,Deep Hindi Meaning
POST,/register,Public,Naya user ya vendor account banane ke liye.
POST,/login,Public,Credentials verify karke JWT token lene ke liye.
POST,/forgotpassword,Public,Email par reset token bhejne ke liye.
PUT,/resetpassword/:token,Public,Token verify karke naya password set karne ke liye.


🛡️ Admin Routes (/api/admin)
Purpose: Global marketplace control (Sirf Admins ke liye).
Method,Endpoint,Access,Deep Hindi Meaning
GET,/vendors,Admin,Saare sellers ki list (Redis cache use karta hai).
PUT,/vendor/:id/status,Admin,Vendor ko block ya active karne ke liye.
PUT,/store/approve/:id,Admin,Pending store application ko live karne ke liye.
GET,/products,Admin,Pure marketplace ka maal ek saath dekhne ke liye.
DELETE,/product/:id,Admin,Kisi bhi galat product ko force-remove karne ke liye.


📦 Product Routes (/api/products)
Purpose: Inventory management.
Method,Endpoint,Access,Deep Hindi Meaning
POST,/add,Seller,Cloudinary par 5 photos tak upload karke maal list karna.
GET,/my-products,Seller,Seller ko sirf apna stock dikhane ke liye.
GET,/:id,Private,Product ki puri details (Edit ya View ke liye).
PUT,/:id,Seller,Stock ya price update karne ke liye.
DELETE,/:id,Seller,Apne product ko marketplace se hatane ke liye.



🏪 Vendor/Store Routes (/api/vendors)
Purpose: Shop identity manage karna.
Method,Endpoint,Access,Deep Hindi Meaning
POST,/apply,User,Store logo aur details bhej kar seller banne ki request.
GET,/settings,Seller,Store ki current details fetch karna (Redis used).
PUT,/update-store,Seller,"Shop ka naam, address ya info badalne ke liye."


👤 User Routes (/api/users)
Purpose: Session aur Profile check.
Method,Endpoint,Access,Deep Hindi Meaning
GET,/me,Private,Logged-in user ki profile aur role refresh karne ke liye.



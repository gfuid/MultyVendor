🗄️ Backend Models Documentation
This document describes the Mongoose Schemas used to manage the data for the Trireme Multi-Vendor Marketplace.

1. 👤 User Model (User.js)
Purpose: Manages authentication, user identity, and authorization levels (RBAC).

role:

Logic: Defaults to user. Can be changed to admin manually in the database.

Deep Meaning: This field dictates which middlewares (admin vs protect) allow the user to pass.

isSeller & sellerStatus:

Logic: isSeller is a boolean toggle; sellerStatus handles the lifecycle (none → pending → approved).

Deep Meaning: This prevents unauthorized users from accessing the Vendor Dashboard until the Admin has verified their business details.

store:

Logic: A reference (ref) to the Store model.

Deep Meaning: Allows for a One-to-One relationship mapping between a user and their business entity.






2. 🏪 Store Model (Store.js)
Purpose: Defines the business profile of a vendor.

owner:

Logic: Stores the ObjectId of the user who created the store.

Deep Meaning: Establishes strict ownership. Only the user linked here can modify store settings.

storeName:

Logic: Set to unique: true.

Deep Meaning: Prevents brand duplication and ensures that each vendor has a distinct identity in the marketplace.

logo:

Logic: Stores the Cloudinary URL string.

Deep Meaning: By storing the URL instead of the file, the database remains lightweight and the image is served via CDN for speed.






3. 📦 Product Model (Product.js)
Purpose: Manages the marketplace inventory, pricing, and visual assets.

seller:

Logic: References the User model.

Deep Meaning: Vital for filtering. When a customer views a "Store Page," we fetch products where seller matches the Store Owner's ID.

price & stock:

Logic: Defined as Number with a default of 0.

Deep Meaning: Using numbers allows the backend to perform logic checks (e.g., "Is the requested quantity > stock?") and prevents negative pricing.

images:

Logic: An Array of Strings.

Deep Meaning: Designed for the Cloudinary integration. This allows a product to have a gallery of images (Main view, Side view, etc.) rather than just one.




Model,Relationship,Description
User ↔ Store,One-to-One,A User (Seller) owns exactly one Store.
User ↔ Product,One-to-Many,One User (Seller) can list multiple Products.
Store ↔ Product,Indirect,"Products are linked to the User, who is linked to the Store."




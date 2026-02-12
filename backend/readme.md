backend/
├── config/             # DB connection, Cloudinary config, Mailer
├── controllers/        # Logic handlers
│   ├── authController.js
│   ├── productController.js
│   ├── storeController.js
│   ├── orderController.js
│   └── adminController.js
├── middleware/         # Auth & Role checks
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/             # Mongoose Schemas
│   ├── User.js         # Unified (User + Seller fields)
│   ├── Store.js        # Store details linked to User
│   ├── Product.js      # Linked to Store & User
│   └── Order.js        # Split-order logic
├── routes/             # API Endpoints
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── storeRoutes.js
│   ├── orderRoutes.js
│   └── adminRoutes.js
├── utils/              # Helper functions (Error handlers, tokens)
└── server.js           # Entry point
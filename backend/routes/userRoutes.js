const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Route: /api/users/me
// protect middleware check karega ki token valid hai ya nahi
router.get('/me', protect, getMe);

module.exports = router;
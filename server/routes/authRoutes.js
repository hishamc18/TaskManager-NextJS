const express = require('express');
const { registerUser, loginUser, logoutUser, getLoggedInUser, deleteUser, promoteUser, getAllUsers } = require('../controllers/authController');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/authMiddleware')

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getLoggedInUser);
router.patch("/delete/:userId", protect, isAdmin, deleteUser);
router.patch("/promote/:userId", protect, isAdmin, promoteUser);
router.get("/getAllUsers", protect, isAdmin, getAllUsers);


module.exports = router;
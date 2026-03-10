const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public auth routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Authenticated user routes
router.post('/changePassword', verifyToken, authController.changePassword);
router.get('/getUser', verifyToken, authController.getUser);

// Admin-only user management routes
router.post('/register', verifyAdmin, authController.register);
router.get('/getUsers', verifyAdmin, authController.getUsers);
router.delete('/deleteUser/:username', verifyAdmin, authController.deleteUser);

module.exports = router;
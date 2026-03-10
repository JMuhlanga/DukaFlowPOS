const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// GET current app settings (singleton)
router.get('/', settingsController.getSettings);

// PUT update settings (singleton)
router.put('/', settingsController.updateSettings);

module.exports = router;


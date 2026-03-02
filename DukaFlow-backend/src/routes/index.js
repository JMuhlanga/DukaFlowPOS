const express = require('express');
const router = express.Router();

// Test route
router.get('/status', (req, res) => {
    res.json({ status: 'DukaFlow API is operational' });
});

module.exports = router;
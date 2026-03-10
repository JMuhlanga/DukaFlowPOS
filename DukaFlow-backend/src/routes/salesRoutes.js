const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// GET all sales
router.get('/', salesController.getAllSales);

// GET a single sale by ID
router.get('/:id', salesController.getSaleById);

// POST create a new sale
router.post('/', salesController.createSale);

// PUT update a sale by ID
router.put('/:id', salesController.updateSale);

// DELETE a sale by ID
router.delete('/:id', salesController.deleteSale);

module.exports = router;
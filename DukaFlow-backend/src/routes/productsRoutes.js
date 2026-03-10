const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// GET all products
router.get('/', productsController.getProducts);

// GET a single product by ID
router.get('/:id', productsController.getProductById);

// POST create a new product
router.post('/', productsController.addProduct);

// PUT update a product
router.put('/:id', productsController.updateProduct);

// PATCH modify stock quantity (+/-)
router.patch('/:id/stock', productsController.modifyStockQuantity);

// DELETE a product
router.delete('/:id', productsController.deleteProduct);

module.exports = router;

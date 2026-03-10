const productsService = require('../services/productsService');

exports.getProducts = async (req, res) => {
    try {
        const data = await productsService.getProducts();
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

exports.getProductById = async (req, res) => {
    try {
        const data = await productsService.getProductById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

exports.addProduct = async (req, res) => {
    try {
        const { name, sku, price, stock_quantity, min_stock_level, category } = req.body;
        const data = await productsService.addProduct({ name, sku, price, stock_quantity, min_stock_level, category });
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, sku, price, stock_quantity, min_stock_level, category } = req.body;
        const data = await productsService.updateProduct({ id, name, sku, price, stock_quantity, min_stock_level, category });
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const data = await productsService.deleteProduct(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

exports.modifyStockQuantity = async (req, res) => {
    try {
        const id = req.params.id;
        const { quantity } = req.body;
        const data = await productsService.modifyStockQuantity({ id, quantity });
        res.json(data);    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}
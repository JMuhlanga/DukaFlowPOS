const productsModel = require('../models/productsModel');

exports.getProducts = async () => {
    try {   
        const products = await productsModel.getProducts();
        return products;
    } catch (error) {
        throw new Error('Failed to get products');
    }
}

exports.getProductById = async (id) => {
    try {
        const product = await productsModel.getProductById(id);
        return product;
    } catch (error) {
        throw new Error('Failed to get product by id');
    }
}

exports.addProduct = async ({ name, sku, price, stock_quantity, min_stock_level }) => {
   try {
    if (!name || !sku || !price || !stock_quantity || !min_stock_level) {
        throw new Error('All fields are required');
    }
    if (typeof name !== 'string' || typeof sku !== 'string' || typeof price !== 'number' || typeof stock_quantity !== 'number' || typeof min_stock_level !== 'number') {
        throw new Error('All fields must be strings and numbers');
    }

        const product = await productsModel.addProduct({ name, sku, price, stock_quantity, min_stock_level });
        return product;
    } catch (error) {
        throw new Error('Failed to add product');
    }
}

exports.updateProduct = async ({ id, name, sku, price, stock_quantity, min_stock_level }) => {
    try {
        if (!id || !name || !sku || !price || !stock_quantity || !min_stock_level) {
            throw new Error('All fields are required');
        }
        if (typeof id !== 'string' || typeof name !== 'string' || typeof sku !== 'string' || typeof price !== 'number' || typeof stock_quantity !== 'number' || typeof min_stock_level !== 'number') {
            throw new Error('All fields must be strings and numbers');
        }
        const product = await productsModel.updateProduct({ id, name, sku, price, stock_quantity, min_stock_level });
        return product;
    } catch (error) {
        throw new Error('Failed to update product');
    }
}

exports.deleteProduct = async (id) => {
    try {
        if (!id) {
            throw new Error('Id is required');
        }
        const product = await productsModel.deleteProduct({ id });
        return product;
    } catch (error) {
        throw new Error('Failed to delete product');
    }
}

exports.modifyStockQuantity = async ({ id, quantity }) => {
    try {
        if (!id || !quantity) {
            throw new Error('Id and quantity are required');
        }
        const product = await productsModel.modifyStockQuantity({ id, quantity });
        return product;
    } catch (error) {
        throw new Error('Failed to modify stock quantity');
    }
}
const db = require('../config/db');

// Fetch all products with the updated schema
exports.getProducts = async () => {
    try {
    const query = 'SELECT * FROM products';
    const [result] = await db.execute(query);
    return result;
    } catch (error) {
        throw new Error('Failed to get products');
    }
};

// Fetch a single product by ID
exports.getProductById = async (id) => {
    try {
    const query = 'SELECT * FROM products WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result[0]; // Returning the object directly is usually cleaner for 'ById'
    } catch (error) {
        throw new Error('Failed to get product by id');
    }
};

// Add a product with inventory fields
exports.addProduct = async ({ name, sku, price, stock_quantity, min_stock_level, category }) => {
    try {
    const query = `
        INSERT INTO products (name, sku, price, stock_quantity, min_stock_level, category) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [name, sku, price, stock_quantity, min_stock_level, category]);
        return result;
    } catch (error) {
        throw new Error('Failed to add product');
    }
};

// Update a product including inventory levels
exports.updateProduct = async ({ id, name, sku, price, stock_quantity, min_stock_level, category }) => {
    try {
    const query = `
        UPDATE products 
        SET name = ?, sku = ?, price = ?, stock_quantity = ?, min_stock_level = ?, category = ? 
        WHERE id = ?
    `;
        const [result] = await db.execute(query, [name, sku, price, stock_quantity, min_stock_level, category, id]);
        return result;
    } catch (error) {
        throw new Error('Failed to update product');
    }
};

// Delete a product
exports.deleteProduct = async ({ id }) => {
    try {
        const query = 'DELETE FROM products WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result;
    } catch (error) {
        throw new Error('Failed to delete product');
    }
};

// Modify stock quantity
exports.modifyStockQuantity = async ({ id, quantity }) => {
    try {
        const query = 'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?';
        const [result] = await db.execute(query, [quantity, id]);
        return result;
    } catch (error) {
        throw new Error('Failed to modify stock quantity');
    }
};
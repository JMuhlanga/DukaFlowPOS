const db = require('../config/db');

exports.getAllSales = async () => {
    try {
        const query = 'SELECT * FROM sales ORDER BY id DESC';
        const [result] = await db.execute(query);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.createSale = async ({ user_id, total_amount, payment_method, items }) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Insert into 'sales' table
        const saleQuery = 'INSERT INTO sales (user_id, total_amount, payment_method) VALUES (?, ?, ?)';
        const [saleResult] = await connection.execute(saleQuery, [user_id, total_amount, payment_method]);
        const saleId = saleResult.insertId;

        // 2. Insert into 'sale_items' table
        const itemQuery = 'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)';
        
        for (const item of items) {
            await connection.execute(itemQuery, [
                saleId, 
                item.product_id, 
                item.quantity, 
                item.unit_price
            ]);
        }

        await connection.commit();
        return { saleId, message: "Sale recorded successfully" };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

/**
 * Retrieves a sale summary including all items for a specific ID
 */
exports.getSaleDetails = async (saleId) => {
    try {
    const query = `
        SELECT s.*, si.product_id, si.quantity, si.unit_price 
        FROM sales s
        JOIN sale_items si ON s.id = si.sale_id
        WHERE s.id = ?
    `;
    const [result] = await db.execute(query, [saleId]);
        return result;
    } catch (error) {
        throw new Error(error.message);
    } 
};

exports.updateSale = async (saleId, { user_id, total_amount, payment_method, items }) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // Update sale header fields (only those provided)
        const fields = [];
        const values = [];

        if (user_id != null) { fields.push('user_id = ?'); values.push(user_id); }
        if (total_amount != null) { fields.push('total_amount = ?'); values.push(total_amount); }
        if (payment_method != null) { fields.push('payment_method = ?'); values.push(payment_method); }

        if (fields.length > 0) {
            const updateQuery = `UPDATE sales SET ${fields.join(', ')} WHERE id = ?`;
            await connection.execute(updateQuery, [...values, saleId]);
        }

        // If items provided, replace all sale_items
        if (Array.isArray(items)) {
            await connection.execute('DELETE FROM sale_items WHERE sale_id = ?', [saleId]);
            const itemQuery = 'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)';
            for (const item of items) {
                await connection.execute(itemQuery, [
                    saleId,
                    item.product_id,
                    item.quantity,
                    item.unit_price
                ]);
            }
        }

        await connection.commit();
        return { saleId, message: 'Sale updated successfully' };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.deleteSale = async (id) => {
    try {
        const itemQuery = 'DELETE FROM sale_items WHERE sale_id = ?';
        await db.execute(itemQuery, [id]);  

        const query = 'DELETE FROM sales WHERE id = ?';
        await db.execute(query, [id]);

        return { message: "Sale deleted successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
}   
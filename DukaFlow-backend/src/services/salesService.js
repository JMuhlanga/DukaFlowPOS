const salesModel = require('../models/salesModel');

exports.getSales = async () => {
    try {
        const sales = await salesModel.getSales();
        return sales;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.getSaleById = async (id) => {
    try {
        const sale = await salesModel.getSaleById(id);
        return sale;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.addSale = async ({ product_id, quantity, price }) => {
    try {
        const sale = await salesModel.addSale({ product_id, quantity, price }); 
        return sale;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.updateSale = async ({ id, product_id, quantity, price }) => {
    try {
        const sale = await salesModel.updateSale({ id, product_id, quantity, price });
        return sale;
    } catch (error) {
        throw new Error(error.message);
    }
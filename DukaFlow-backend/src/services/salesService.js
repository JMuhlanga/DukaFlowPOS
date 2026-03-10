const salesModel = require('../models/salesModel');

exports.getAllSales = async () => {
  try {
    return await salesModel.getAllSales();
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getSaleById = async (id) => {
  try {
    return await salesModel.getSaleDetails(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.createSale = async ({ user_id, total_amount, payment_method, items }) => {
  try {
    if (!user_id || total_amount == null || !payment_method || !Array.isArray(items) || items.length === 0) {
      throw new Error('user_id, total_amount, payment_method, and items are required');
    }
    return await salesModel.createSale({ user_id, total_amount, payment_method, items });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateSale = async (id, { user_id, total_amount, payment_method, items }) => {
  try {
    if (!id) throw new Error('id is required');
    return await salesModel.updateSale(id, { user_id, total_amount, payment_method, items });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteSale = async (id) => {
  try {
    if (!id) throw new Error('id is required');
    return await salesModel.deleteSale(id);
  } catch (error) {
    throw new Error(error.message);
  }
};
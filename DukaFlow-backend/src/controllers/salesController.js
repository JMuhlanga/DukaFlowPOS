const salesService = require('../services/salesService')

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await salesService.getAllSales();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await salesService.getSaleById(id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new sale
exports.createSale = async (req, res) => {
  try {
    const saleData = req.body;
    const newSale = await salesService.createSale(saleData);
    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing sale by ID
exports.updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const saleData = req.body;
    const updatedSale = await salesService.updateSale(id, saleData);
    if (!updatedSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json(updatedSale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a sale by ID
exports.deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await salesService.deleteSale(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


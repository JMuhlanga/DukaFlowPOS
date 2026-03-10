const dashboardService = require('../services/dashboardService');

exports.getStats = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


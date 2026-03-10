const dashboardModel = require('../models/dashboardModel');

exports.getDashboardStats = async () => {
  try {
    return await dashboardModel.getDashboardStats();
  } catch (error) {
    throw new Error(error.message);
  }
};


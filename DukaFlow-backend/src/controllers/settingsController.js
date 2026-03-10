const settingsService = require('../services/settingsService');

exports.getSettings = async (req, res) => {
  try {
    const data = await settingsService.getSettings();
    res.json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const data = await settingsService.updateSettings(req.body);
    res.json({ message: 'Settings updated successfully', settings: data });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};


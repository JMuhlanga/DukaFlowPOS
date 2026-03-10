const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const data = await authService.registerUser({ username, password, role });
    res.json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = await authService.loginUser({ username, password });
    res.json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { username, token } = req.body;
    const data = await authService.logoutUser({ username, token });
    res.json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { username } = req.body;
    const data = await authService.getUser({ username });
    res.json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const data = await authService.getUsers();
    res.json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    const data = await authService.deleteUser({ username });
    res.json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const username = req.user?.username;
    const data = await authService.changePassword({ username, currentPassword, newPassword });
    res.json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
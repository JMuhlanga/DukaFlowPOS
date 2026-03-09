const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    await authService.registerUser(req.body);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
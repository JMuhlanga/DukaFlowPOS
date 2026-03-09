const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

exports.registerUser = async ({ username, password, role }) => {
  try {
    if (!username || !password || !role) {
      throw new Error('Username, password and role are required');
    }
    if (role !== 'admin' && role !== 'user') {
      throw new Error('Invalid role');
    }
    if (username.length < 3 || username.length > 20) {
      throw new Error('Username must be between 3 and 20 characters');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await authModel.registerUser({ username, password: hashedPassword, role });
    return result;
  } catch (error) {
    throw new Error('Failed to register user');
  }
}

exports.loginUser = async ({ username, password }) => {
  try{
    if (!username || !password) {
      throw new Error('Username and password are required');
    }
    const users = await authModel.getUsers();
    const user = users.find(user => user.username === username);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    return user;
  } catch (error) {
    throw new Error('Failed to login user');
  }
}

exports.logoutUser = async ({ username }) => {
  try {
    if (!username || !token) {
      throw new Error('Username and token are required');
    }
    const result = await authModel.logoutUser({ username, token });
    return result;
  } catch (error) {
    throw new Error('Failed to logout user');
  }
}

expor
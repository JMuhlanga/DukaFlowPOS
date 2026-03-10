const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

exports.registerUser = async ({ username, password, role }) => {
  try {

    if (!username || !password || !role) {
      throw new Error('Username, password and role are required');
    }

    if (role !== 'admin' && role !== 'user') {
      throw new Error('Invalid role. Must be "admin" or "user"');
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
    throw new Error(error.message);
  }
};

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
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await authModel.setUserToken({ username: user.username, token });

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      token,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to login user');
  }
}

exports.logoutUser = async ({ username, token }) => {
  try {
    if (!username || !token) {
      throw new Error('Username and token are required');
    }
    const result = await authModel.logoutUser({ username, token });
    return result;
  } catch (error) {
    throw new Error(error.message || 'Failed to logout user');
  }
}

exports.changePassword = async ({ username, currentPassword, newPassword }) => {
  try {
    if (!username) throw new Error('Username is required');
    if (!currentPassword || !newPassword) throw new Error('Current password and new password are required');
    if (String(newPassword).length < 8) throw new Error('Password must be at least 8 characters long');

    const rows = await authModel.getUserByUsername({ username });
    const user = Array.isArray(rows) ? rows[0] : null;
    if (!user) throw new Error('User not found');

    const ok = await bcrypt.compare(currentPassword, user.password_hash);
    if (!ok) throw new Error('Invalid password');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await authModel.updatePasswordHash({ username, passwordHash: hashedPassword });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    await authModel.setUserToken({ username: user.username, token });

    return {
      user: { id: user.id, username: user.username, role: user.role },
      token,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to change password');
  }
};

exports.getUsers = async () => {
  try {
    const result = await authModel.getUsers();
    return result;
  } catch (error) {
    throw new Error('Failed to get users');
  }
}

exports.deleteUser = async ({ username }) => {
  try {
    const result = await authModel.deleteUser({ username });
    return result;
  } catch (error) {
    throw new Error('Failed to delete user');
  }
}

exports.updateUser = async ({ username, password, role }) => {
  try {
    const result = await authModel.updateUser({ username, password, role });
    return result;
  } catch (error) {
    throw new Error('Failed to update user');
  }
}
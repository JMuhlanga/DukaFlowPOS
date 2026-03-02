const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  async registerUser(userData) {
    const { username, password, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [username, hashedPassword, role]);
    return result;
  }

  async login(username, password) {
    const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return { token, user: { id: user.id, username: user.username, role: user.role } };
  }
}

module.exports = new AuthService();
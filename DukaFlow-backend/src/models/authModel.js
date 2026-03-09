const db = require('../config/db');

exports.registerUser = async ({ username, password, role }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [username, hashedPassword, role]);
    return result;
}

exports.getUsers = async () => {
    const query = 'SELECT * FROM users';
    const [result] = await db.execute(query);
    return result;
}

exports.logoutUser = async ({ username, token }) => {
    const query = 'UPDATE users SET token = NULL WHERE username = ?';
    const [result] = await db.execute(query, [username]);
    return result;
}

exports.getUserByUsername = async ({ username }) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [result] = await db.execute(query, [username]);
    return result;
}


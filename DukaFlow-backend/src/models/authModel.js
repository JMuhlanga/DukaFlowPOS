const db = require('../config/db');

exports.registerUser = async ({ username, password, role }) => {
    try {
        const query = 'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)';
        const [result] = await db.execute(query, [username, password, role]);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.getUsers = async () => {
    try {
        const query = 'SELECT * FROM users';
        const [result] = await db.execute(query);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.logoutUser = async ({ username, token }) => {
    try {
        const query = 'UPDATE users SET token = NULL WHERE username = ?';
        const [result] = await db.execute(query, [username]);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.setUserToken = async ({ username, token }) => {
    try {
        const query = 'UPDATE users SET token = ? WHERE username = ?';
        const [result] = await db.execute(query, [token, username]);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.updatePasswordHash = async ({ username, passwordHash }) => {
    try {
        const query = 'UPDATE users SET password_hash = ? WHERE username = ?';
        const [result] = await db.execute(query, [passwordHash, username]);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.getUserByUsername = async ({ username }) => {
    try {
        const query = 'SELECT * FROM users WHERE username = ?';
        const [result] = await db.execute(query, [username]);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.deleteUser = async ({ username }) => { 
    try {
        const query = 'DELETE FROM users WHERE username = ?';
        const [result] = await db.execute(query, [username]);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.updateUser = async ({ username, password, role }) => {
    try {
        const query = 'UPDATE users SET password_hash = ?, role = ? WHERE username = ?';
        const [result] = await db.execute(query, [password, role, username]);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}
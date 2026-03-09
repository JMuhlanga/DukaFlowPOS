const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Import Routes
const authRoutes = require('./routes/authRoutes');

// Import Middleware
const loggerMiddleware = require('./middleware/logger');

// Middleware
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('DukaFlow API is running...');
});

// Routes
app.use('/api/auth', authRoutes);


// Example of using the DB in a route
const db = require('./config/db');
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Database reachable!', data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// src/app.js
const express = require('express');
const morgan = require('morgan'); // optional logging
const noteRoutes = require('./routes/note.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Mount routes under /api/notes
app.use('/api/notes', noteRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;

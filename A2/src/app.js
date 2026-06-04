// src/app.js
const express = require('express');
const cors = require('cors'); // optional if cross-origin needed
const noteRoutes = require('./routes/note.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api/notes', noteRoutes);

// Global error handler (fallback)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error', data: null });
});

module.exports = app;

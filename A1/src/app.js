const express = require('express');
const NoteRouter = require('./routes/note.routes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/notes', NoteRouter);

module.exports = app;

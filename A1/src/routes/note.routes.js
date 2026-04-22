const express = require('express');
const NoteRouter = express.Router();
const {
    createNote
} = require('../controllers/note.controller');

NoteRouter.post('/', createNote);

module.exports = NoteRouter;
const express = require('express');
const NoteRouter = express.Router();
const {
    createNote,
    createNotesBulk
} = require('../controllers/note.controller');

NoteRouter.post('/bulk', createNotesBulk);
NoteRouter.post('/', createNote);

module.exports = NoteRouter;
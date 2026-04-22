const express = require('express');
const NoteRouter = express.Router();
const {
    createNote,
    createNotesBulk,
    getNotes,
    getNoteById
} = require('../controllers/note.controller');

NoteRouter.post('/bulk', createNotesBulk);
NoteRouter.post('/', createNote);
NoteRouter.get('/', getNotes);
NoteRouter.get('/:id', getNoteById);

module.exports = NoteRouter;
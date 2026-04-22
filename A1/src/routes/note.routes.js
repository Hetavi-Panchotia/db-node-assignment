const express = require('express');
const NoteRouter = express.Router();
const {
    createNote,
    createNotesBulk,
    getNotes,
    getNoteById,
    replaceNote,
    updateNote,
    deleteNote
} = require('../controllers/note.controller');

NoteRouter.post('/bulk', createNotesBulk);
NoteRouter.post('/', createNote);
NoteRouter.get('/', getNotes);
NoteRouter.get('/:id', getNoteById);
NoteRouter.put('/:id', replaceNote);
NoteRouter.patch('/:id', updateNote);
NoteRouter.delete('/:id', deleteNote);

module.exports = NoteRouter;
const express = require('express');
const NoteRouter = express.Router();
const {
    createNote,
    createNotesBulk,
    getNotes,
    getNoteById,
    replaceNote,
    updateNote,
    deleteNote,
    deleteNotesBulk
} = require('../controllers/note.controller');

NoteRouter.post('/bulk', createNotesBulk);
NoteRouter.delete('/bulk', deleteNotesBulk);

NoteRouter.post('/', createNote);
NoteRouter.get('/', getNotes);
NoteRouter.get('/:id', getNoteById);
NoteRouter.put('/:id', replaceNote);
NoteRouter.patch('/:id', updateNote);
NoteRouter.delete('/:id', deleteNote);

<<<<<<< HEAD
module.exports = NoteRouter;
=======
module.exports = NoteRouter;
>>>>>>> 685e71c6c065f928a6ed58a2657c077d9d35b796

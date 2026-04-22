const Note = require('../models/note.model');
const mongoose = require('mongoose');

// Helper for invalid ID check
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// 1. Create a single note
const createNote = async (req, res) => {
    try {
        const { title, content, category, isPinned } = req.body;
        if (!title || !content) {
            return res.status(400).json({ 
                success: false, 
                message: "Title and content are required",
                data: null
            });
        }
        const note = new Note({ title, content, category, isPinned });
        await note.save();
        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
            data: null
        });
    }
};

// 2. Create multiple notes (Bulk)
const createNotesBulk = async (req, res) => {
    try {
        const { notes } = req.body;
        if (!notes || !Array.isArray(notes) || notes.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Notes array is required and cannot be empty",
                data: null
            });
        }
        const createdNotes = await Note.insertMany(notes);
        res.status(201).json({
            success: true,
            message: `${createdNotes.length} notes created successfully`,
            data: createdNotes
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
            data: null
        });
    }
};

module.exports = {
    createNote,
    createNotesBulk
};

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

// 3. Get all notes
const getNotes = async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            data: notes
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
            data: null
        });
    }
};

// 4. Get a single note by ID
const getNoteById = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Note ID",
                data: null
            });
        }
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ 
                success: false, 
                message: "Note not found",
                data: null
            });
        }
        res.status(200).json({
            success: true,
            message: "Note fetched successfully",
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

// 5. Replace a note completely (PUT)
const replaceNote = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Note ID",
                data: null
            });
        }
        const { title, content, category, isPinned } = req.body;
        // PUT requires all fields. If not provided, they should reset to defaults.
        // overwrite: true replaces the entire document.
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content, category, isPinned },
            { new: true, overwrite: true, runValidators: true }
        );
        if (!note) {
            return res.status(404).json({ 
                success: false, 
                message: "Note not found",
                data: null
            });
        }
        res.status(200).json({
            success: true,
            message: "Note replaced successfully",
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

// 6. Update specific fields (PATCH)
const updateNote = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Note ID",
                data: null
            });
        }
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "No fields provided to update",
                data: null
            });
        }
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!note) {
            return res.status(404).json({ 
                success: false, 
                message: "Note not found",
                data: null
            });
        }
        res.status(200).json({
            success: true,
            message: "Note updated successfully",
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

// 7. Delete a single note
const deleteNote = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Note ID",
                data: null
            });
        }
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ 
                success: false, 
                message: "Note not found",
                data: null
            });
        }
        res.status(200).json({ 
            success: true,
            message: "Note deleted successfully",
            data: null
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
            data: null
        });
    }
};

// 8. Delete multiple notes (Bulk)
const deleteNotesBulk = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "IDs array is required and cannot be empty",
                data: null
            });
        }
        const result = await Note.deleteMany({ _id: { $in: ids } });
        res.status(200).json({
            success: true,
            message: `${result.deletedCount} notes deleted successfully`,
            data: null
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
    createNotesBulk,
    getNotes,
    getNoteById,
    replaceNote,
    updateNote,
    deleteNote,
    deleteNotesBulk
};

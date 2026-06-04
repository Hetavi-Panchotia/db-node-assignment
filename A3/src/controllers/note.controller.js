// src/controllers/note.controller.js
const Note = require('../models/note.model');

// Helper for standard response
const sendResponse = (res, status, success, message, data = null, extra = {}) => {
  const payload = { success, message, data };
  Object.assign(payload, extra);
  return res.status(status).json(payload);
};

// 1. POST /api/notes - create a single note
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;
    if (!title || !content) {
      return sendResponse(res, 400, false, 'Title and content are required', null);
    }
    const note = await Note.create({ title, content, category, isPinned });
    return sendResponse(res, 201, true, 'Note created successfully', note);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};

// 2. POST /api/notes/bulk - create multiple notes
exports.createBulkNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    if (!Array.isArray(notes) || notes.length === 0) {
      return sendResponse(res, 400, false, 'notes array is required and cannot be empty', null);
    }
    const created = await Note.insertMany(notes);
    return sendResponse(res, 201, true, `${created.length} notes created successfully`, created);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};

// 3. GET /api/notes - get all notes (no pagination for now)
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    return sendResponse(res, 200, true, 'Notes fetched successfully', notes, { count: notes.length });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};

// Placeholder for remaining handlers (will be filled later)
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid note ID', null);
    }
    const note = await Note.findById(id);
    if (!note) {
      return sendResponse(res, 404, false, 'Note not found', null);
    }
    return sendResponse(res, 200, true, 'Note fetched successfully', note);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};
exports.replaceNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid note ID', null);
    }
    const { title, content, category, isPinned } = req.body;
    if (!title || !content) {
      return sendResponse(res, 400, false, 'Title and content are required', null);
    }
    const updated = await Note.findOneAndUpdate(
      { _id: id },
      { title, content, category, isPinned },
      { new: true, overwrite: true, runValidators: true }
    );
    if (!updated) {
      return sendResponse(res, 404, false, 'Note not found', null);
    }
    return sendResponse(res, 200, true, 'Note replaced successfully', updated);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid note ID', null);
    }
    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return sendResponse(res, 400, false, 'No fields provided to update', null);
    }
    const updated = await Note.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) {
      return sendResponse(res, 404, false, 'Note not found', null);
    }
    return sendResponse(res, 200, true, 'Note updated successfully', updated);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};
exports.deleteNote = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented' }); };
exports.deleteBulkNotes = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented' }); };
// Search and combined handlers placeholders
exports.searchByTitle = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented' }); };
exports.searchByContent = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented' }); };
exports.searchAll = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented' }); };
exports.filterAndSort = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented' }); };
exports.filterAndPaginate = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented' }); };
exports.sortAndPaginate = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented' }); };
exports.searchAndFilter = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented' }); };
exports.searchSortPaginate = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented' }); };
exports.filterSortPaginate = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented' }); };
exports.masterQuery = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented' }); };

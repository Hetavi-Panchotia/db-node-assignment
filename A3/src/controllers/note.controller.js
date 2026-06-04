// src/controllers/note.controller.js
const Note = require('../models/note.model');
const mongoose = require('mongoose');

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
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid note ID', null);
    }
    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) {
      return sendResponse(res, 404, false, 'Note not found', null);
    }
    return sendResponse(res, 200, true, 'Note deleted successfully', null);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};
exports.deleteBulkNotes = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return sendResponse(res, 400, false, 'ids array is required and cannot be empty', null);
    }
    const result = await Note.deleteMany({ _id: { $in: ids } });
    return sendResponse(res, 200, true, `${result.deletedCount} notes deleted successfully`, null);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};
// Search and combined handlers placeholders
exports.searchByTitle = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return sendResponse(res, 400, false, "Search query 'q' is required", null);
    }
    const notes = await Note.find({ title: { $regex: q, $options: 'i' } });
    return sendResponse(res, 200, true, `Search results for: ${q}`, notes, { count: notes.length });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};
exports.searchByContent = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return sendResponse(res, 400, false, "Search query 'q' is required", null);
    }
    const notes = await Note.find({ content: { $regex: q, $options: 'i' } });
    return sendResponse(res, 200, true, `Content search results for: ${q}`, notes, { count: notes.length });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};
exports.searchAll = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return sendResponse(res, 400, false, "Search query 'q' is required", null);
    }
    const notes = await Note.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ],
    });
    return sendResponse(res, 200, true, `Search results for: ${q}`, notes, { count: notes.length });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};
exports.filterAndSort = async (req, res) => {
  try {
    const { category, isPinned, sortBy = 'createdAt', order = 'desc' } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === 'true';
    const allowedSortFields = ['title', 'category', 'createdAt', 'updatedAt', 'isPinned'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    const notes = await Note.find(filter).sort({ [sortField]: sortOrder });
    return sendResponse(res, 200, true, 'Notes fetched successfully', notes, { count: notes.length });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};
exports.filterAndPaginate = async (req, res) => {
  try {
    const { category, isPinned, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === 'true';
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter).skip(skip).limit(limitNum);
    return sendResponse(res, 200, true, 'Notes fetched successfully', notes, {
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};
exports.sortAndPaginate = async (req, res) => {
  try {
    const { sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
    const allowedSortFields = ['title', 'category', 'createdAt', 'updatedAt', 'isPinned'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const total = await Note.countDocuments({});
    const notes = await Note.find({})
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum);
    return sendResponse(res, 200, true, 'Notes fetched successfully', notes, {
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};
exports.searchAndFilter = async (req, res) => {
  try {
    const { q, category, isPinned } = req.query;
    if (!q) {
      return sendResponse(res, 400, false, "Search query 'q' is required", null);
    }
    const filter = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ],
    };
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === 'true';
    const notes = await Note.find(filter);
    return sendResponse(res, 200, true, `Search results for: ${q}`, notes, { count: notes.length });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};
exports.searchSortPaginate = async (req, res) => {
  try {
    const { q, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
    if (!q) {
      return sendResponse(res, 400, false, "Search query 'q' is required", null);
    }
    const filter = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ],
    };
    const allowedSortFields = ['title', 'category', 'createdAt', 'updatedAt', 'isPinned'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum);
    return sendResponse(res, 200, true, `Search results for: ${q}`, notes, {
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};
exports.filterSortPaginate = async (req, res) => {
  try {
    const {
      category,
      isPinned,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === 'true';

    const allowedSortFields = ['title', 'category', 'createdAt', 'updatedAt', 'isPinned'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    return sendResponse(res, 200, true, 'Notes fetched successfully', notes, {
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};
exports.masterQuery = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented' }); };

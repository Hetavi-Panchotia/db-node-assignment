// src/controllers/note.controller.js
const Note = require('../models/note.model');

// Helper for consistent responses
const sendResponse = (res, statusCode, success, message, data = null, extra = {}) => {
  const payload = { success, message, data };
  return res.status(statusCode).json({ ...payload, ...extra });
};

// 1. Create single note
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;
    if (!title || !content) {
      return sendResponse(res, 400, false, 'Title and content are required');
    }
    const note = await Note.create({ title, content, category, isPinned });
    return sendResponse(res, 201, true, 'Note created successfully', note);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 2. Create bulk notes
exports.createBulkNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    if (!Array.isArray(notes) || notes.length === 0) {
      return sendResponse(res, 400, false, 'notes array is required and cannot be empty');
    }
    const created = await Note.insertMany(notes);
    return sendResponse(res, 201, true, `${created.length} notes created successfully`, created);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 3. Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    return sendResponse(res, 200, true, 'Notes fetched successfully', notes, { count: notes.length });
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 4. Get note by ID
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendResponse(res, 400, false, 'Invalid note ID');
    }
    const note = await Note.findById(id);
    if (!note) {
      return sendResponse(res, 404, false, 'Note not found');
    }
    return sendResponse(res, 200, true, 'Note fetched successfully', note);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 5. Replace (PUT) note
exports.replaceNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendResponse(res, 400, false, 'Invalid note ID');
    }
    const { title, content, category, isPinned } = req.body;
    const updated = await Note.findOneAndUpdate(
      { _id: id },
      { title, content, category, isPinned },
      { new: true, overwrite: true, runValidators: true }
    );
    if (!updated) {
      return sendResponse(res, 404, false, 'Note not found');
    }
    return sendResponse(res, 200, true, 'Note replaced successfully', updated);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 6. Patch (partial) note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendResponse(res, 400, false, 'Invalid note ID');
    }
    if (Object.keys(req.body).length === 0) {
      return sendResponse(res, 400, false, 'No fields provided to update');
    }
    const updated = await Note.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return sendResponse(res, 404, false, 'Note not found');
    }
    return sendResponse(res, 200, true, 'Note updated successfully', updated);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 7. Delete single note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendResponse(res, 400, false, 'Invalid note ID');
    }
    const result = await Note.findByIdAndDelete(id);
    if (!result) {
      return sendResponse(res, 404, false, 'Note not found');
    }
    return sendResponse(res, 200, true, 'Note deleted successfully', null);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 8. Delete bulk notes
exports.deleteBulkNotes = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return sendResponse(res, 400, false, 'ids array is required and cannot be empty');
    }
    const result = await Note.deleteMany({ _id: { $in: ids } });
    return sendResponse(res, 200, true, `${result.deletedCount} notes deleted successfully`, null);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 9. Get notes by category (route param)
exports.getNotesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const allowed = ['work', 'personal', 'study'];
    if (!allowed.includes(category)) {
      return sendResponse(res, 400, false, 'Invalid category. Allowed: work, personal, study');
    }
    const notes = await Note.find({ category });
    if (notes.length === 0) {
      return sendResponse(res, 404, false, `No notes found for category: ${category}`);
    }
    return sendResponse(res, 200, true, `Notes fetched for category: ${category}`, notes, { count: notes.length });
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 10. Get notes by pinned status (route param)
exports.getNotesByStatus = async (req, res) => {
  try {
    const { isPinned } = req.params;
    if (isPinned !== 'true' && isPinned !== 'false') {
      return sendResponse(res, 400, false, 'isPinned must be true or false');
    }
    const pinned = isPinned === 'true';
    const notes = await Note.find({ isPinned: pinned });
    return sendResponse(res, 200, true, 'Fetched all pinned notes', notes, { count: notes.length });
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 11. Get note summary
exports.getNoteSummary = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendResponse(res, 400, false, 'Invalid note ID');
    }
    const note = await Note.findById(id).select('title category isPinned createdAt');
    if (!note) {
      return sendResponse(res, 404, false, 'Note not found');
    }
    return sendResponse(res, 200, true, 'Note summary fetched successfully', note);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 12. General filter (query params)
exports.filterNotes = async (req, res) => {
  try {
    const { category, isPinned } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === 'true';
    const notes = await Note.find(filter);
    return sendResponse(res, 200, true, 'Notes fetched successfully', notes, { count: notes.length });
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 13. Get pinned notes (query)
exports.getPinnedNotes = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isPinned: true };
    if (category) filter.category = category;
    const notes = await Note.find(filter);
    return sendResponse(res, 200, true, 'Pinned notes fetched successfully', notes, { count: notes.length });
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 14. Filter by category (query param name)
exports.filterByCategory = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return sendResponse(res, 400, false, "Query param 'name' is required");
    }
    const notes = await Note.find({ category: name });
    return sendResponse(res, 200, true, `Notes filtered by category: ${name}`, notes, { count: notes.length });
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 15. Filter by date range
exports.filterByDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return sendResponse(res, 400, false, "Both 'from' and 'to' query params are required");
    }
    const filter = { createdAt: { $gte: new Date(from), $lte: new Date(to) } };
    const notes = await Note.find(filter);
    return sendResponse(res, 200, true, `Notes fetched between ${from} and ${to}`, notes, { count: notes.length });
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 16. Pagination (all)
exports.paginateNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Note.countDocuments();
    const notes = await Note.find().skip(skip).limit(limit);
    const pagination = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    };
    return sendResponse(res, 200, true, 'Notes fetched successfully', notes, { pagination });
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 17. Pagination by category
exports.paginateByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = { category };
    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter).skip(skip).limit(limit);
    const pagination = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    };
    return sendResponse(res, 200, true, `Notes fetched for category: ${category}`, notes, { pagination });
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 18. Sort notes
exports.sortNotes = async (req, res) => {
  try {
    const allowed = ['title', 'createdAt', 'updatedAt', 'category'];
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    if (!allowed.includes(sortBy)) {
      return sendResponse(res, 400, false, 'Invalid sortBy. Allowed: title, createdAt, updatedAt, category');
    }
    const notes = await Note.find().sort({ [sortBy]: order });
    return sendResponse(res, 200, true, `Notes sorted by ${sortBy} in ${order === 1 ? 'ascending' : 'descending'} order`, notes, { count: notes.length });
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// 19. Sort pinned notes
exports.sortPinnedNotes = async (req, res) => {
  try {
    const allowed = ['title', 'createdAt', 'updatedAt', 'category'];
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    if (!allowed.includes(sortBy)) {
      return sendResponse(res, 400, false, 'Invalid sortBy. Allowed: title, createdAt, updatedAt, category');
    }
    const notes = await Note.find({ isPinned: true }).sort({ [sortBy]: order });
    return sendResponse(res, 200, true, `Pinned notes sorted by ${sortBy} in ${order === 1 ? 'ascending' : 'descending'} order`, notes, { count: notes.length });
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

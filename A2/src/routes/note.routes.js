// src/routes/note.routes.js
const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');

// CRUD bulk routes first
router.post('/bulk', noteController.createBulkNotes);
router.delete('/bulk', noteController.deleteBulkNotes);

// Route parameter routes
router.get('/category/:category', noteController.getNotesByCategory);
router.get('/status/:isPinned', noteController.getNotesByStatus);

// Query parameter routes
router.get('/filter', noteController.filterNotes);
router.get('/filter/pinned', noteController.getPinnedNotes);
router.get('/filter/category', noteController.filterByCategory);
router.get('/filter/date-range', noteController.filterByDateRange);

// Pagination routes
router.get('/paginate', noteController.paginateNotes);
router.get('/paginate/category/:category', noteController.paginateByCategory);

// Sorting routes
router.get('/sort', noteController.sortNotes);
router.get('/sort/pinned', noteController.sortPinnedNotes);

// CRUD single-item routes (order matters)
router.post('/', noteController.createNote);
router.get('/', noteController.getAllNotes);
router.get('/:id/summary', noteController.getNoteSummary);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.replaceNote);
router.patch('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;

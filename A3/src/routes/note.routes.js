// src/routes/note.routes.js
const express = require('express');
const router = express.Router();
const {
  // CRUD
  createNote,
  createBulkNotes,
  getAllNotes,
  getNoteById,
  replaceNote,
  updateNote,
  deleteNote,
  deleteBulkNotes,
  // Search
  searchByTitle,
  searchByContent,
  searchAll,
  // Combined two concepts
  filterAndSort,
  filterAndPaginate,
  sortAndPaginate,
  searchAndFilter,
  // Combined three concepts
  searchSortPaginate,
  filterSortPaginate,
  // Master endpoint
  masterQuery,
} = require('../controllers/note.controller');

// ---------- Bulk CRUD ----------
router.post('/bulk', createBulkNotes);
router.delete('/bulk', deleteBulkNotes);

// ---------- Search Routes ----------
router.get('/search', searchByTitle);
router.get('/search/content', searchByContent);
router.get('/search/all', searchAll);

// ---------- Combined Two Concepts ----------
router.get('/filter-sort', filterAndSort);
router.get('/filter-paginate', filterAndPaginate);
router.get('/sort-paginate', sortAndPaginate);
router.get('/search-filter', searchAndFilter);

// ---------- Combined Three Concepts ----------
router.get('/search-sort-paginate', searchSortPaginate);
router.get('/filter-sort-paginate', filterSortPaginate);

// ---------- Master Query ----------
router.get('/query', masterQuery);

// ---------- CRUD Single Item Routes ----------
router.post('/', createNote);
router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.put('/:id', replaceNote);
router.patch('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;

const express = require('express')
const router = express.Router()

const {
  getEvents,
  setEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController')

const { protect } = require('../middleware/authMiddleware')

// ---- Routes for /api/events/ ------------------------------------------------
// GET  /api/events/  → protect runs first, then getEvents
// POST /api/events/  → protect runs first, then setEvent

router.route('/').get(protect, getEvents).post(protect, setEvent)

// ---- Routes for /api/events/:id ----------------------------------------------
// PUT    /api/events/:id → protect runs first, then updateEvent
// DELETE /api/events/:id → protect runs first, then deleteEvent

router.route('/:id').put(protect, updateEvent).delete(protect, deleteEvent)

module.exports = router
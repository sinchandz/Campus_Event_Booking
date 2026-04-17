const express = require('express');
const router = express.Router();
const { getDashboardStats, getEventBookings } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/bookings/:eventId', protect, adminOnly, getEventBookings);

module.exports = router;

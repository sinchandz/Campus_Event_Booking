const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalBookings = await Booking.countDocuments({ status: 'confirmed' });
    const upcomingEvents = await Event.countDocuments({ date: { $gte: new Date() } });

    // Get recent bookings
    const recentBookings = await Booking.find({ status: 'confirmed' })
      .populate('event', 'title date')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get category distribution
    const categoryStats = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalEvents,
      totalUsers,
      totalBookings,
      upcomingEvents,
      recentBookings,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get bookings for a specific event
// @route   GET /api/admin/bookings/:eventId
// @access  Admin
const getEventBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ event: req.params.eventId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardStats, getEventBookings };

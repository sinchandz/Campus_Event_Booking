const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Book an event
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { eventId } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check seat availability
    if (event.bookedSeats >= event.totalSeats) {
      return res.status(400).json({ message: 'No seats available for this event' });
    }

    // Check for existing booking
    const existingBooking = await Booking.findOne({
      event: eventId,
      user: req.user._id,
      status: 'confirmed'
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this event' });
    }

    // Create booking
    const booking = await Booking.create({
      event: eventId,
      user: req.user._id,
      status: 'confirmed'
    });

    // Increment booked seats
    event.bookedSeats += 1;
    await event.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('event')
      .populate('user', 'name email');

    res.status(201).json(populatedBooking);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already booked this event' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Decrement booked seats
    const event = await Event.findById(booking.event);
    if (event && event.bookedSeats > 0) {
      event.bookedSeats -= 1;
      await event.save();
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking };

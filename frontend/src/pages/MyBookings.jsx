import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await bookingService.cancel(bookingId);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  return (
    <div className="bookings-page">
      <div className="container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>Manage your event registrations</p>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎫</span>
            <h3>No bookings yet</h3>
            <p>Explore events and book your first one!</p>
            <Link to="/events" className="btn btn-teal">Browse Events</Link>
          </div>
        ) : (
          <>
            {confirmedBookings.length > 0 && (
              <div className="bookings-section">
                <h2 className="section-label">
                  <span className="status-dot confirmed"></span>
                  Active Bookings ({confirmedBookings.length})
                </h2>
                <div className="bookings-list">
                  {confirmedBookings.map((booking) => (
                    <div key={booking._id} className="booking-card-item" id={`booking-${booking._id}`}>
                      <div className="booking-card-image">
                        {booking.event?.image ? (
                          <img src={booking.event.image} alt={booking.event?.title} />
                        ) : (
                          <div className="booking-placeholder">🎉</div>
                        )}
                      </div>
                      <div className="booking-card-content">
                        <div className="booking-info">
                          <h3><Link to={`/events/${booking.event?._id}`}>{booking.event?.title || 'Event Deleted'}</Link></h3>
                          <div className="booking-meta">
                            <span>📅 {booking.event?.date ? formatDate(booking.event.date) : 'N/A'}</span>
                            <span>🕐 {booking.event?.time || 'N/A'}</span>
                            <span>📍 {booking.event?.venue || 'N/A'}</span>
                          </div>
                          <div className="booking-status confirmed">
                            <span>✅ Confirmed</span>
                            <span className="booking-date">Booked on {formatDate(booking.createdAt)}</span>
                          </div>
                        </div>
                        <div className="booking-actions">
                          <Link to={`/events/${booking.event?._id}`} className="btn btn-outline btn-sm">View Event</Link>
                          <button className="btn btn-danger btn-sm" onClick={() => handleCancel(booking._id)} disabled={cancelling === booking._id}>
                            {cancelling === booking._id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cancelledBookings.length > 0 && (
              <div className="bookings-section">
                <h2 className="section-label">
                  <span className="status-dot cancelled"></span>
                  Cancelled Bookings ({cancelledBookings.length})
                </h2>
                <div className="bookings-list">
                  {cancelledBookings.map((booking) => (
                    <div key={booking._id} className="booking-card-item cancelled">
                      <div className="booking-card-image">
                        {booking.event?.image ? (
                          <img src={booking.event.image} alt={booking.event?.title} />
                        ) : (
                          <div className="booking-placeholder">📋</div>
                        )}
                      </div>
                      <div className="booking-card-content">
                        <div className="booking-info">
                          <h3>{booking.event?.title || 'Event Deleted'}</h3>
                          <div className="booking-meta">
                            <span>📅 {booking.event?.date ? formatDate(booking.event.date) : 'N/A'}</span>
                          </div>
                          <div className="booking-status cancelled-text">
                            <span>❌ Cancelled</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const categoryColors = {
  seminar: { bg: '#7C3AED', label: 'Seminar' },
  workshop: { bg: '#0F766E', label: 'Workshop' },
  cultural: { bg: '#E89A2D', label: 'Cultural' },
  competition: { bg: '#2563EB', label: 'Competition' },
  sports: { bg: '#DC2626', label: 'Sports' },
  tech: { bg: '#7C3AED', label: 'Tech' }
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEvent();
    if (isAuthenticated && !isAdmin) {
      checkBookingStatus();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await eventService.getOne(id);
      setEvent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkBookingStatus = async () => {
    try {
      const res = await bookingService.getMyBookings();
      const isBooked = res.data.some(b => b.event?._id === id && b.status === 'confirmed');
      setBooked(isBooked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  const confirmBooking = async () => {
    setBooking(true);
    try {
      await bookingService.create(id);
      setBooked(true);
      setMessage({ text: 'Event booked successfully! 🎉', type: 'success' });
      setShowModal(false);
      fetchEvent();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Booking failed', type: 'error' });
      setShowModal(false);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  if (!event) {
    return (
      <div className="error-page">
        <div className="container">
          <h2>Event Not Found</h2>
          <p>The event you're looking for doesn't exist.</p>
          <Link to="/events" className="btn btn-teal">Browse Events</Link>
        </div>
      </div>
    );
  }

  const cat = categoryColors[event.category] || categoryColors.seminar;
  const availableSeats = event.totalSeats - event.bookedSeats;
  const percentBooked = (event.bookedSeats / event.totalSeats) * 100;
  const isFull = availableSeats <= 0;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="event-detail-page">
      {/* Hero Banner */}
      <div className="event-detail-hero">
        {event.image ? (
          <img src={event.image} alt={event.title} className="event-detail-bg" />
        ) : (
          <div className="event-detail-bg-gradient" style={{ background: cat.bg }}></div>
        )}
        <div className="event-detail-hero-overlay">
          <div className="container">
            <Link to="/events" className="back-link">← Back to Events</Link>
            <span className="event-detail-category" style={{ background: cat.bg }}>{cat.label}</span>
            <h1>{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="event-detail-content">
          {/* Main Content */}
          <div className="event-detail-main">
            {message.text && (
              <div className={`alert alert-${message.type}`}>{message.text}</div>
            )}

            <div className="detail-section">
              <h2>About This Event</h2>
              <p className="event-description">{event.description}</p>
            </div>

            <div className="detail-section">
              <h2>Event Details</h2>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <div>
                    <strong>Date</strong>
                    <p>{formatDate(event.date)}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🕐</span>
                  <div>
                    <strong>Time</strong>
                    <p>{event.time}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <div>
                    <strong>Venue</strong>
                    <p>{event.venue}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🏷️</span>
                  <div>
                    <strong>Category</strong>
                    <p style={{ textTransform: 'capitalize' }}>{event.category}</p>
                  </div>
                </div>
              </div>
            </div>

            {event.createdBy && (
              <div className="detail-section">
                <h2>Organized By</h2>
                <div className="organizer-card">
                  <div className="organizer-avatar">
                    {event.createdBy.name?.charAt(0)}
                  </div>
                  <div>
                    <strong>{event.createdBy.name}</strong>
                    <p>{event.createdBy.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="event-detail-sidebar">
            <div className="booking-card">
              <h3>Seat Availability</h3>
              <div className="seat-display">
                <div className="seat-numbers">
                  <div className="seat-stat">
                    <span className="seat-stat-number">{availableSeats}</span>
                    <span className="seat-stat-label">Available</span>
                  </div>
                  <div className="seat-stat">
                    <span className="seat-stat-number">{event.bookedSeats}</span>
                    <span className="seat-stat-label">Booked</span>
                  </div>
                  <div className="seat-stat">
                    <span className="seat-stat-number">{event.totalSeats}</span>
                    <span className="seat-stat-label">Total</span>
                  </div>
                </div>
                <div className="seat-bar large">
                  <div 
                    className={`seat-bar-fill ${isFull ? 'full' : percentBooked >= 80 ? 'warning' : ''}`}
                    style={{ width: `${Math.min(percentBooked, 100)}%` }}
                  ></div>
                </div>
                <p className="seat-percent">{Math.round(percentBooked)}% booked</p>
              </div>

              {!isAdmin && (
                <>
                  {booked ? (
                    <div className="booked-badge">
                      <span>✅</span> You've booked this event
                    </div>
                  ) : isFull ? (
                    <button className="btn btn-block btn-disabled" disabled>
                      Sold Out
                    </button>
                  ) : (
                    <button 
                      className="btn btn-teal btn-block btn-lg"
                      onClick={handleBooking}
                      disabled={booking}
                      id="book-event-btn"
                    >
                      {booking ? 'Booking...' : 'Book Now — Free'}
                    </button>
                  )}
                </>
              )}

              {!isAuthenticated && (
                <p className="login-prompt">
                  <Link to="/login">Sign in</Link> to book this event
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Booking</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>You're about to book:</p>
              <div className="modal-event-info">
                <h4>{event.title}</h4>
                <p>📅 {formatDate(event.date)} | 🕐 {event.time}</p>
                <p>📍 {event.venue}</p>
              </div>
              <p className="modal-note">A seat will be reserved for you.</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button 
                className="btn btn-teal" 
                onClick={confirmBooking}
                disabled={booking}
                id="confirm-booking-btn"
              >
                {booking ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;

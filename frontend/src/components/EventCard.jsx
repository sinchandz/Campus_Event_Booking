import { Link } from 'react-router-dom';

const categoryColors = {
  seminar: { bg: '#7C3AED', label: 'Seminar' },
  workshop: { bg: '#0F766E', label: 'Workshop' },
  cultural: { bg: '#E89A2D', label: 'Cultural' },
  competition: { bg: '#2563EB', label: 'Competition' },
  sports: { bg: '#DC2626', label: 'Sports' },
  tech: { bg: '#7C3AED', label: 'Tech' }
};

const EventCard = ({ event }) => {
  const category = categoryColors[event.category] || categoryColors.seminar;
  const availableSeats = event.totalSeats - event.bookedSeats;
  const percentBooked = Math.round((event.bookedSeats / event.totalSeats) * 100);
  const isAlmostFull = percentBooked >= 80;
  const isFull = availableSeats <= 0;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const getPercentClass = () => {
    if (isFull) return 'danger-text';
    if (isAlmostFull) return 'warning-text';
    return '';
  };

  return (
    <Link to={`/events/${event._id}`} className="event-card" id={`event-card-${event._id}`}>
      <div className="event-card-image">
        {event.image ? (
          <img src={event.image} alt={event.title} loading="lazy" />
        ) : (
          <div className="event-card-placeholder">
            <span>{event.title.charAt(0)}</span>
          </div>
        )}
        <span className="event-card-category" style={{ background: category.bg }}>
          {category.label}
        </span>
      </div>
      
      <div className="event-card-content">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-desc">{event.description.substring(0, 100)}...</p>
        
        <div className="event-card-meta">
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">🕐</span>
            <span>{event.time}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📍</span>
            <span>{event.venue}</span>
          </div>
        </div>

        <div className="event-card-footer">
          <div className="seat-info">
            <div className="seat-header">
              <span className="seat-text">💺 {availableSeats} seats left</span>
              <span className={`seat-percent ${getPercentClass()}`}>{percentBooked}% filled</span>
            </div>
            <div className="seat-bar">
              <div 
                className={`seat-bar-fill ${isFull ? 'full' : isAlmostFull ? 'warning' : ''}`}
                style={{ width: `${Math.min(percentBooked, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

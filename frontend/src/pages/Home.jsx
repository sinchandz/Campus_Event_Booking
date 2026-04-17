import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import EventCard from '../components/EventCard';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventService.getAll({ upcoming: 'true' });
        setEvents(res.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const features = [
    { icon: '⚡', title: 'Instant Booking', desc: 'Register for events in seconds with real time seat tracking', color: 'teal' },
    { icon: '🛡️', title: 'Secure Auth', desc: 'JWT based authentication keeps your data safe', color: 'green' },
    { icon: '👥', title: 'Role-Based Access', desc: 'Separate dashboards for students and administrators', color: 'blue' },
    { icon: '📋', title: 'Event Management', desc: 'Create, update, and manage events effortlessly', color: 'purple' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-particles">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}></div>
            ))}
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">GLA UNIVERSITY, MATHURA</div>
          <h1 className="hero-title">
            Campus Events,<br />
            <span className="gradient-text">Simplified.</span>
          </h1>
          <p className="hero-subtitle">
            Discover, register, and manage college events in one place. From workshops to 
            cultural fests — never miss what's happening on campus.
          </p>
          <div className="hero-actions">
            <Link to="/events" className="btn btn-primary btn-lg">
              <span>Browse Events</span>
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/register" className="btn btn-dark btn-lg">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Why CampusBook Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why CampusBook?</h2>
            <p className="section-subtitle">A smarter way to handle campus event registrations</p>
          </div>
          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`feature-icon-wrapper ${feature.color}`}>
                  <span>{feature.icon}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="upcoming-section">
        <div className="container">
          <div className="upcoming-header">
            <div>
              <h2>Upcoming Events</h2>
              <p>Don't miss out on these popular events</p>
            </div>
            <Link to="/events" className="view-all-btn">
              View All <span>→</span>
            </Link>
          </div>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="events-grid">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📅</span>
              <p>No upcoming events found. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready to Get Started?</h2>
              <p>Create an account and start booking events in seconds.</p>
              <Link to="/register" className="btn btn-primary btn-lg">
                Sign Up Free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span>📅</span>
              <span>CampusBook</span>
              <p>Your one-stop platform for all campus events.</p>
            </div>
            <div className="footer-links">
              <Link to="/events">Events</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 CampusBook. Built with MERN Stack.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

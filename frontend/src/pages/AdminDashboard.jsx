import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminService, eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'seminar', date: '', time: '',
    venue: '', totalSeats: '', image: ''
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashRes, eventsRes] = await Promise.all([
        adminService.getDashboard(),
        eventService.getAll()
      ]);
      setStats(dashRes.data);
      setEvents(eventsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', category: 'seminar', date: '', time: '',
      venue: '', totalSeats: '', image: ''
    });
    setEditingEvent(null);
    setShowCreateForm(false);
    setFormError('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await eventService.create({ ...formData, totalSeats: parseInt(formData.totalSeats) });
      resetForm();
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date.split('T')[0],
      time: event.time,
      venue: event.venue,
      totalSeats: event.totalSeats.toString(),
      image: event.image || ''
    });
    setShowCreateForm(true);
    setActiveTab('events');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await eventService.update(editingEvent._id, { ...formData, totalSeats: parseInt(formData.totalSeats) });
      resetForm();
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update event');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventService.delete(eventId);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  const sidebarItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'events', icon: '📅', label: 'Manage Events' },
    { id: 'bookings', icon: '🎫', label: 'Recent Bookings' },
    { id: 'create', icon: '➕', label: 'Create Event' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <span>📅</span>
            <span>CampusBook Admin</span>
          </div>
          <ul className="admin-nav">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'create') {
                      resetForm();
                      setShowCreateForm(true);
                      setActiveTab('events');
                    }
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="admin-sidebar-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="table-avatar">{user?.name?.charAt(0) || 'A'}</div>
              <div>
                <strong style={{ fontSize: '0.85rem', display: 'block' }}>{user?.name || 'Admin'}</strong>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{user?.email}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="admin-content">
          {/* Mobile tab selector */}
          <div style={{ display: 'none' }} className="admin-mobile-tabs">
            {sidebarItems.filter(i => i.id !== 'create').map(item => (
              <button key={item.id} className={`category-tab ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              <div className="admin-content-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back! Here's what's happening on CampusBook.</p>
              </div>

              {stats && (
                <div className="admin-stats">
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: '#E0F7F5', color: '#0F766E' }}>📅</div>
                    <div className="admin-stat-info">
                      <span className="admin-stat-number">{stats.totalEvents}</span>
                      <span className="admin-stat-label">Total Events</span>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>👥</div>
                    <div className="admin-stat-info">
                      <span className="admin-stat-number">{stats.totalUsers}</span>
                      <span className="admin-stat-label">Students</span>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>🎫</div>
                    <div className="admin-stat-info">
                      <span className="admin-stat-number">{stats.totalBookings}</span>
                      <span className="admin-stat-label">Bookings</span>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}>🔮</div>
                    <div className="admin-stat-info">
                      <span className="admin-stat-number">{stats.upcomingEvents}</span>
                      <span className="admin-stat-label">Upcoming</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
                <button className="btn btn-teal" onClick={() => { resetForm(); setShowCreateForm(true); setActiveTab('events'); }} id="create-event-btn">
                  ➕ Create New Event
                </button>
                <button className="btn btn-outline" onClick={() => setActiveTab('events')}>
                  📅 View All Events
                </button>
                <button className="btn btn-outline" onClick={() => setActiveTab('bookings')}>
                  🎫 View Bookings
                </button>
              </div>

              {/* Recent Bookings Preview */}
              {stats?.recentBookings?.length > 0 && (
                <div className="admin-section">
                  <h2>📋 Recent Bookings</h2>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Event</th>
                          <th>Booked On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentBookings.slice(0, 5).map((booking) => (
                          <tr key={booking._id}>
                            <td>
                              <div className="table-user">
                                <div className="table-avatar">{booking.user?.name?.charAt(0) || '?'}</div>
                                <div>
                                  <strong>{booking.user?.name || 'Unknown'}</strong>
                                  <span>{booking.user?.email || ''}</span>
                                </div>
                              </div>
                            </td>
                            <td>{booking.event?.title || 'Deleted Event'}</td>
                            <td>{formatDate(booking.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Events Summary */}
              <div className="admin-section">
                <h2>📅 Latest Events</h2>
                <div className="admin-events-list">
                  {events.slice(0, 4).map((event) => (
                    <div key={event._id} className="admin-event-card">
                      <div className="admin-event-image">
                        {event.image ? <img src={event.image} alt={event.title} /> : <div className="admin-event-placeholder">📅</div>}
                      </div>
                      <div className="admin-event-info">
                        <h3><Link to={`/events/${event._id}`}>{event.title}</Link></h3>
                        <div className="admin-event-meta">
                          <span>📅 {formatDate(event.date)}</span>
                          <span>📍 {event.venue}</span>
                          <span>💺 {event.bookedSeats}/{event.totalSeats} booked</span>
                        </div>
                      </div>
                      <div className="admin-event-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => handleEdit(event)}>✏️ Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <>
              <div className="admin-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1>Manage Events</h1>
                  <p>Create, edit, and delete events</p>
                </div>
                <button className="btn btn-teal" onClick={() => { resetForm(); setShowCreateForm(!showCreateForm); }}>
                  {showCreateForm && !editingEvent ? '✕ Close' : '➕ Create Event'}
                </button>
              </div>

              {showCreateForm && (
                <div className="admin-form-card">
                  <h2>{editingEvent ? '✏️ Edit Event' : '➕ Create New Event'}</h2>
                  {formError && <div className="alert alert-error">{formError}</div>}

                  <form onSubmit={editingEvent ? handleUpdate : handleCreate} className="admin-form" id="event-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="title">Event Title</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleFormChange} required placeholder="Enter event title" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select id="category" name="category" value={formData.category} onChange={handleFormChange}>
                          <option value="seminar">Seminar</option>
                          <option value="workshop">Workshop</option>
                          <option value="cultural">Cultural</option>
                          <option value="competition">Competition</option>
                          <option value="sports">Sports</option>
                          <option value="tech">Tech</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <textarea id="description" name="description" value={formData.description} onChange={handleFormChange} required rows="4" placeholder="Describe the event..."></textarea>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={handleFormChange} required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="time">Time</label>
                        <input type="text" id="time" name="time" value={formData.time} onChange={handleFormChange} required placeholder="e.g. 10:00 AM - 4:00 PM" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="venue">Venue</label>
                        <input type="text" id="venue" name="venue" value={formData.venue} onChange={handleFormChange} required placeholder="Event location" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="totalSeats">Total Seats</label>
                        <input type="number" id="totalSeats" name="totalSeats" value={formData.totalSeats} onChange={handleFormChange} required min="1" placeholder="Number of seats" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="image">Image URL (optional)</label>
                      <input type="url" id="image" name="image" value={formData.image} onChange={handleFormChange} placeholder="https://example.com/image.jpg" />
                    </div>

                    <div className="form-actions">
                      <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
                      <button type="submit" className="btn btn-teal" disabled={formLoading} id="submit-event-btn">
                        {formLoading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="admin-events-list">
                {events.map((event) => (
                  <div key={event._id} className="admin-event-card" id={`admin-event-${event._id}`}>
                    <div className="admin-event-image">
                      {event.image ? <img src={event.image} alt={event.title} /> : <div className="admin-event-placeholder">📅</div>}
                    </div>
                    <div className="admin-event-info">
                      <h3><Link to={`/events/${event._id}`}>{event.title}</Link></h3>
                      <div className="admin-event-meta">
                        <span>📅 {formatDate(event.date)}</span>
                        <span>📍 {event.venue}</span>
                        <span>💺 {event.bookedSeats}/{event.totalSeats} booked</span>
                        <span style={{ textTransform: 'capitalize' }}>🏷️ {event.category}</span>
                      </div>
                    </div>
                    <div className="admin-event-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(event)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(event._id)}>🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <>
              <div className="admin-content-header">
                <h1>All Bookings</h1>
                <p>View all student registrations</p>
              </div>

              {stats?.recentBookings?.length > 0 ? (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Email</th>
                        <th>Event</th>
                        <th>Booked On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td>
                            <div className="table-user">
                              <div className="table-avatar">{booking.user?.name?.charAt(0) || '?'}</div>
                              <div>
                                <strong>{booking.user?.name || 'Unknown'}</strong>
                              </div>
                            </div>
                          </td>
                          <td style={{ color: '#6B7280' }}>{booking.user?.email || 'N/A'}</td>
                          <td>{booking.event?.title || 'Deleted Event'}</td>
                          <td>{formatDate(booking.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">🎫</span>
                  <h3>No bookings yet</h3>
                  <p>Bookings will appear here once students register for events.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

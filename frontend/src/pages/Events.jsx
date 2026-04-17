import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../services/api';
import EventCard from '../components/EventCard';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');

  const categories = [
    { value: 'all', label: '🌟 All Events' },
    { value: 'seminar', label: '🎤 Seminars' },
    { value: 'workshop', label: '🔧 Workshops' },
    { value: 'cultural', label: '🎭 Cultural' },
    { value: 'competition', label: '🏆 Competitions' },
    { value: 'sports', label: '⚽ Sports' },
    { value: 'tech', label: '💻 Tech' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'all') params.category = category;
      if (search) params.search = search;
      const res = await eventService.getAll(params);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSearchParams(cat !== 'all' ? { category: cat } : {});
  };

  return (
    <div className="events-page">
      <div className="events-hero">
        <div className="container">
          <h1>Campus Events</h1>
          <p>Discover and book the best events happening on campus</p>
          
          <form className="search-bar" onSubmit={handleSearch} id="events-search-form">
            <input
              type="text"
              placeholder="Search events by title, venue, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="events-search-input"
            />
            <button type="submit" className="btn btn-teal" id="events-search-btn">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="container">
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`category-tab ${category === cat.value ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <h3>No events found</h3>
            <p>Try adjusting your search or category filter</p>
            <button 
              className="btn btn-outline" 
              onClick={() => { setSearch(''); setCategory('all'); }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;

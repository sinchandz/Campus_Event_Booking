import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/events');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <span className="auth-visual-icon">📅</span>
            <h2>Welcome Back!</h2>
            <p>Sign in to access your campus event bookings and discover new events.</p>
            <div className="auth-visual-features">
              <div className="feature-item"><span>✓</span> Browse & book events instantly</div>
              <div className="feature-item"><span>✓</span> Track your registrations</div>
              <div className="feature-item"><span>✓</span> Get seat availability updates</div>
            </div>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <h1>Sign In</h1>
            <p className="auth-subtitle">Enter your credentials to continue</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form" id="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@campus.edu" required autoComplete="email" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required autoComplete="current-password" />
              </div>
              <button type="submit" className="btn btn-teal btn-block" disabled={loading} id="login-submit">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-divider"><span>Demo Accounts</span></div>

            <div className="demo-accounts">
              <button className="btn btn-outline btn-sm" onClick={() => setFormData({ email: 'admin@campus.edu', password: 'admin123' })}>🔑 Admin</button>
              <button className="btn btn-outline btn-sm" onClick={() => setFormData({ email: 'student@campus.edu', password: 'student123' })}>🎓 Student</button>
            </div>

            <p className="auth-switch">Don't have an account? <Link to="/register">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

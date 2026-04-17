import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual register-visual">
          <div className="auth-visual-content">
            <span className="auth-visual-icon">🚀</span>
            <h2>Join CampusBook</h2>
            <p>Create your account and unlock access to all campus events, workshops, and competitions.</p>
            <div className="auth-visual-features">
              <div className="feature-item"><span>✓</span> Free registration</div>
              <div className="feature-item"><span>✓</span> Book events with one click</div>
              <div className="feature-item"><span>✓</span> Manage all bookings in one place</div>
              <div className="feature-item"><span>✓</span> Real-time seat tracking</div>
            </div>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <h1>Create Account</h1>
            <p className="auth-subtitle">Fill in your details to get started</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form" id="register-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
              </div>
              <div className="form-group">
                <label htmlFor="reg-email">Email Address</label>
                <input type="email" id="reg-email" name="email" value={formData.email} onChange={handleChange} placeholder="you@campus.edu" required autoComplete="email" />
              </div>
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <input type="password" id="reg-password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" required />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" required />
              </div>
              <button type="submit" className="btn btn-teal btn-block" disabled={loading} id="register-submit">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

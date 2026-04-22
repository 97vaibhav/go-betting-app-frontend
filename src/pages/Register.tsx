import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { useAuthStore } from '../stores/useAuthStore';
import Button from '../components/Button';
import styles from './Auth.module.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    dob: '',
    mobile: '',
    country: 'India',
    currency: 'INR'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiClient('/identity/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      setAuth(data.user, data.access_token, data.refresh_token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h2>Join Bet365</h2>
        <p>Create your account and start betting today</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              name="full_name"
              value={formData.full_name} 
              onChange={handleChange} 
              required 
              placeholder="John Doe"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="email@example.com"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="Create a strong password"
            />
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Date of Birth</label>
              <input 
                type="date" 
                name="dob"
                value={formData.dob} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Currency</label>
              <select name="currency" value={formData.currency} onChange={handleChange}>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
          <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
            {loading ? 'Creating Account...' : 'JOIN NOW'}
          </Button>
        </form>
        
        <div className={styles.footer}>
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

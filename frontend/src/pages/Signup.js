import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://pixnest-backend.onrender.com/api/auth/signup', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          style={styles.input}
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />
        <input
          style={styles.input}
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          style={styles.input}
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button style={styles.btn} onClick={handleSubmit}>Sign Up</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5'
  },
  box: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '350px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '14px'
  },
  btn: {
    padding: '10px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  error: { color: 'red', fontSize: '13px' }
};

export default Signup;
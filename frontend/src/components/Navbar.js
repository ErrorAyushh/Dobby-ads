import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>📁 Dobby Ads</h2>
      <div style={styles.right}>
        <span style={styles.name}>Hi, {user?.name}</span>
        <button onClick={handleLogout} style={styles.btn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 30px',
    backgroundColor: '#1a1a2e',
    color: 'white'
  },
  logo: { margin: 0 },
  right: { display: 'flex', alignItems: 'center', gap: '15px' },
  name: { fontSize: '14px' },
  btn: {
    padding: '8px 16px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default Navbar;
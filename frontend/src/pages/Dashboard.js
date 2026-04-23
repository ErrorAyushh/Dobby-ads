import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const API = 'https://pixnest-backend.onrender.com';

function Dashboard() {
  const { token } = useAuth();
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [images, setImages] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [imageName, setImageName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchFolders();
    if (currentFolder) fetchImages();
  }, [currentFolder]);

  const fetchFolders = async () => {
    try {
      const url = currentFolder
        ? `${API}/api/folders/${currentFolder}/children`
        : `${API}/api/folders`;
      const res = await axios.get(url, { headers });
      setFolders(res.data);
    } catch (err) {
      setError('Failed to load folders');
    }
  };

  const fetchImages = async () => {
    try {
      const res = await axios.get(
        `${API}/api/images/folder/${currentFolder}`,
        { headers }
      );
      setImages(res.data);
    } catch (err) {
      setError('Failed to load images');
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await axios.post(
        `${API}/api/folders`,
        { name: newFolderName, parent: currentFolder },
        { headers }
      );
      setNewFolderName('');
      fetchFolders();
    } catch (err) {
      setError('Failed to create folder');
    }
  };

  const uploadImage = async () => {
    if (!imageName.trim() || !imageFile || !currentFolder) {
      setError('Please enter image name, select a file, and open a folder first');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', imageName);
      formData.append('image', imageFile);
      formData.append('folder', currentFolder);
      await axios.post(`${API}/api/images`, formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      setImageName('');
      setImageFile(null);
      fetchImages();
      fetchFolders();
    } catch (err) {
      setError('Failed to upload image');
    }
  };

  const openFolder = (folder) => {
    setFolderPath([...folderPath, { id: currentFolder, name: currentFolder ? '...' : 'Home' }]);
    setCurrentFolder(folder._id);
    setImages([]);
  };

  const goBack = () => {
    const prev = folderPath[folderPath.length - 1];
    setFolderPath(folderPath.slice(0, -1));
    setCurrentFolder(prev.id);
    setImages([]);
  };

  const deleteFolder = async (id) => {
    try {
      await axios.delete(`${API}/api/folders/${id}`, { headers });
      fetchFolders();
    } catch (err) {
      setError('Failed to delete folder');
    }
  };

  const deleteImage = async (id) => {
    try {
      await axios.delete(`${API}/api/images/${id}`, { headers });
      fetchImages();
      fetchFolders();
    } catch (err) {
      setError('Failed to delete image');
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>

        {currentFolder && (
          <button onClick={goBack} style={styles.backBtn}>
            ← Back
          </button>
        )}

        {error && <p style={styles.error}>{error}</p>}

        {/* Create Folder */}
        <div style={styles.card}>
          <h3>📁 New Folder</h3>
          <div style={styles.row}>
            <input
              style={styles.input}
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <button style={styles.btn} onClick={createFolder}>
              Create
            </button>
          </div>
        </div>

        {/* Upload Image */}
        {currentFolder && (
          <div style={styles.card}>
            <h3>🖼️ Upload Image</h3>
            <div style={styles.row}>
              <input
                style={styles.input}
                placeholder="Image name"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <button style={styles.btn} onClick={uploadImage}>
                Upload
              </button>
            </div>
          </div>
        )}

        {/* Folders Grid */}
        <h3 style={{ marginTop: '30px' }}>
          {currentFolder ? 'Subfolders' : 'My Folders'}
        </h3>
        {folders.length === 0 && <p style={styles.empty}>No folders yet</p>}
        <div style={styles.grid}>
          {folders.map((folder) => (
            <div key={folder._id} style={styles.folderCard}>
              <div
                style={styles.folderIcon}
                onClick={() => openFolder(folder)}
              >
                📁
              </div>
              <p style={styles.folderName}>{folder.name}</p>
              <p style={styles.size}>{formatSize(folder.size)}</p>
              <button
                style={styles.deleteBtn}
                onClick={() => deleteFolder(folder._id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Images Grid */}
        {currentFolder && (
          <>
            <h3 style={{ marginTop: '30px' }}>Images</h3>
            {images.length === 0 && (
              <p style={styles.empty}>No images in this folder</p>
            )}
            <div style={styles.grid}>
              {images.map((img) => (
                <div key={img._id} style={styles.imageCard}>
                  <img
                    src={`${API}/uploads/${img.filename}`}
                    alt={img.name}
                    style={styles.image}
                  />
                  <p style={styles.folderName}>{img.name}</p>
                  <p style={styles.size}>{formatSize(img.size)}</p>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteImage(img._id)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  row: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '14px',
    flex: 1
  },
  btn: {
    padding: '10px 20px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  backBtn: {
    padding: '8px 16px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px',
    marginTop: '10px'
  },
  folderCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '15px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    cursor: 'pointer'
  },
  imageCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '15px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  folderIcon: {
    fontSize: '40px',
    cursor: 'pointer'
  },
  folderName: {
    fontSize: '13px',
    fontWeight: 'bold',
    margin: '5px 0',
    wordBreak: 'break-word'
  },
  size: {
    fontSize: '11px',
    color: '#888',
    margin: '2px 0'
  },
  image: {
    width: '100%',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '5px'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '5px'
  },
  error: {
    color: 'red',
    fontSize: '13px',
    marginBottom: '10px'
  },
  empty: {
    color: '#aaa',
    fontSize: '14px'
  }
};

export default Dashboard;
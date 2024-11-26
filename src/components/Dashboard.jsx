import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      navigate('/');
    } else {
      setUserData({ nombre: userName, correo: localStorage.getItem('userEmail') });
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Máximo: 50 MB.');
        setFile(null);
        return;
      }
      if (!selectedFile.type.startsWith('video/')) {
        setError('Solo se permiten archivos de video.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setFileType(selectedFile.type);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !file) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    setIsUploading(true);
    // Lógica de subida de archivo...
    setIsUploading(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Bienvenido, {userData?.nombre}</h1>
        <p>{userData?.correo}</p>
      </header>
      <main className="dashboard-main">
        <form className="dashboard-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <label htmlFor="file-upload">Sube un archivo:</label>
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              accept="video/*"
              onChange={handleFileChange}
            />
            <div className="file-preview">
              {file ? <p>{file.name}</p> : <p>No hay archivo seleccionado</p>}
            </div>
          </div>
          <div className="form-section">
            <label htmlFor="title">Título:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del video"
            />
          </div>
          <div className="form-section">
            <label htmlFor="description">Descripción:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del video"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className="primary-button" type="submit" disabled={isUploading}>
            {isUploading ? 'Subiendo...' : 'Subir video'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Dashboard;

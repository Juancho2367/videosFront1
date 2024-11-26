import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/DashboardMain.css';

const DashboardMain = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('https://back-notubeyet.vercel.app/v1/tubeyet/getVideos');
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        } else {
          console.error('No se pudieron obtener los videos');
        }
      } catch (error) {
        console.error('Error al obtener los videos:', error);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadClick = () => {
    navigate('/dashboard');
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Redirige a la página de perfil
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-main">
      <header className="dashboard-header">
        <button className="header-button">Inicio</button>
        <input
          type="text"
          placeholder="Buscar..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="header-button" onClick={handleUploadClick}>
          Subir video
        </button>
        <button className="header-button" onClick={handleProfileClick}>
          Mi perfil
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <main className="video-grid">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <div key={video._id} className="video-card">
              <video
                width="300"
                height="200"
                controls
                className="video-preview"
              >
                <source src={video.fileUrl} type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
              <h3 className="video-title">{video.title}</h3>
              <p className="video-date">
                Subido el: {new Date(video.uploadDate).toLocaleDateString()}
              </p>
              <p className="video-uploader">
                Subido por: <strong>{video.uploadedBy}</strong>
              </p>
            </div>
          ))
        ) : (
          <p>No se encontraron videos</p>
        )}
      </main>
    </div>
  );
};

export default DashboardMain;

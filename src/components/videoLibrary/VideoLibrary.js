import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoLibrary.css';

const VideoLibrary = ({ refreshTrigger, userSubscriptions = [] }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);
  const currentVideoRef = useRef(null);
  const navigate = useNavigate();

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/video-library', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Fixed template literal
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again.');
        } else {
          throw new Error(`Failed to fetch videos: ${response.statusText}`); // Improved error message
        }
      }

      const data = await response.json();
      setVideos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [refreshTrigger]);

  const handleSessionToggle = (session) => {
    setExpandedSession(expandedSession === session ? null : session);
  };

  const handleVideoPlay = (event) => {
    if (currentVideoRef.current && currentVideoRef.current !== event.target) {
      currentVideoRef.current.pause();
    }
    currentVideoRef.current = event.target;
  };

  const handleSessionPayment = (sessionName) => {
    navigate('/payment', { state: { sessionName } });
  };

  if (loading) return <p className="loading">Loading videos...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  if (videos.length === 0) return <p>No videos found in the library.</p>;

  const sessions = videos.reduce((acc, video) => {
    const sessionName = video.session || 'General';
    if (!acc[sessionName]) {
      acc[sessionName] = [];
    }
    acc[sessionName].push(video);
    return acc;
  }, {});

  const sortedSessionKeys = Object.keys(sessions).sort((a, b) => {
    return a === 'General' ? -1 : b === 'General' ? 1 : 0;
  });

  return (
    <div className="video-library">
      <h2>Video Library</h2>
      <ul>
        {sortedSessionKeys.map((session) => (
          <li key={session}>
            <div className="session-header">
              <h3 onClick={() => handleSessionToggle(session)} style={{ cursor: 'pointer' }}>
                {session}
              </h3>
              {session === 'General' ? (
                <span>Free to Watch</span>
              ) : (
                <button onClick={() => handleSessionPayment(session)}>Pay for Session</button>
              )}
            </div>
            {expandedSession === session && (
              <ul>
                {sessions[session].map((video) => (
                  <li key={video._id}>
                    <h4>{video.title}</h4>
                    {video.poster && (
                      <img
                        src={`http://localhost:5000/${video.poster}`} // Wrapped in quotes
                        alt="Video Poster"
                        style={{ maxWidth: '200px' }}
                      />
                    )}
                    {userSubscriptions.includes(session) || session === 'General' ? ( // Simplified condition
                      <video
                        controls
                        src={`http://localhost:5000/${video.path}`} // Wrapped in quotes
                        onPlay={handleVideoPlay}
                      />
                    ) : (
                      <p style={{ color: 'red' }}>Please subscribe to watch this video.</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoLibrary;

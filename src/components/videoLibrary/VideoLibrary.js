import React, { useState, useEffect, useRef } from 'react';
import './VideoLibrary.css'; // Ensure CSS classes are defined

const VideoLibrary = ({ refreshTrigger }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null); // To track which session is expanded
  const currentVideoRef = useRef(null); // Ref to track the currently playing video

  // Fetch videos from the server
  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/video-library', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again.');
        } else {
          throw new Error('Failed to fetch videos');
        }
      }

      const data = await response.json();
      console.log('Fetched videos:', data); // Debugging log
      setVideos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching videos:', err); // Debugging log
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [refreshTrigger]); // Re-fetch videos when refreshTrigger changes

  // Toggle session visibility
  const handleSessionToggle = (session) => {
    setExpandedSession(expandedSession === session ? null : session);
  };

  // Handle video playback: pause the currently playing video if a new one is played
  const handleVideoPlay = (event) => {
    if (currentVideoRef.current && currentVideoRef.current !== event.target) {
      currentVideoRef.current.pause();
    }
    currentVideoRef.current = event.target;
  };

  if (loading) return <p className="loading">Loading videos...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  if (videos.length === 0) return <p>No videos found in the library.</p>;

  // Group videos by session
  const sessions = videos.reduce((acc, video) => {
    const sessionName = video.session || 'General'; // Handle undefined sessions
    if (!acc[sessionName]) {
      acc[sessionName] = [];
    }
    acc[sessionName].push(video);
    return acc;
  }, {});

  return (
    <div className="video-library">
      <h2>Video Library</h2>
      <ul>
        {Object.keys(sessions).map((session) => (
          <li key={session}>
            <h3 onClick={() => handleSessionToggle(session)} style={{ cursor: 'pointer' }}>
              {session}
            </h3>
            {expandedSession === session && (
              <ul>
                {sessions[session].map((video) => (
                  <li key={video._id}>
                    <h4>{video.title}</h4>
                    {video.poster && (
                      <img
                        src={`http://localhost:5000/${video.poster}`}
                        alt="Video Poster"
                      />
                    )}
                    <video
                      controls
                      src={`http://localhost:5000/${video.path}`}
                      onPlay={handleVideoPlay} // Restrict playback if necessary
                    />
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

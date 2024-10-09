import React, { useState, useEffect, useRef } from 'react';
import './VideoLibrary.css'; // Import the CSS file

const VideoLibrary = ({ refreshTrigger }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null); // To track which session is expanded
  const currentVideoRef = useRef(null); // Ref to track the currently playing video

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
      console.log('Fetched videos:', data); // Log the fetched data to check structure
      setVideos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching videos:', err); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [refreshTrigger]); // Re-fetch videos when refreshTrigger changes

  const handleSessionToggle = (session) => {
    setExpandedSession(expandedSession === session ? null : session);
  };

  const handleVideoPlay = (event) => {
    // Pause the currently playing video if there is one
    if (currentVideoRef.current && currentVideoRef.current !== event.target) {
      currentVideoRef.current.pause();
    }
    // Set the new video as the currently playing one
    currentVideoRef.current = event.target;
  };

  if (loading) return <p className="loading">Loading videos...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  if (videos.length === 0) return <p>No videos found in the library.</p>;

  // Group videos by session
  const sessions = videos.reduce((acc, video) => {
    if (video.session) {
      if (!acc[video.session]) {
        acc[video.session] = [];
      }
      acc[video.session].push(video);
    } else {
      if (!acc['General']) {
        acc['General'] = [];
      }
      acc['General'].push(video);
    }
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
                    <video
                      controls
                      src={`http://localhost:5000/${video.path}`}
                      onPlay={handleVideoPlay} // Attach event handler to restrict playback
                    />
                    {video.poster && (
                      <img
                        src={`http://localhost:5000/${video.poster}`}
                        alt="Video Poster"
                      />
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

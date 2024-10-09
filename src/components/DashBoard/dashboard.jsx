import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import './dashboard.css'; // Import the CSS for styling
import VideoUpload from '../VideoUploads'; // Import the VideoUpload component

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false); // State to manage upload form visibility
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin

  const toggleUpload = () => {
    setIsUploadOpen((prev) => !prev);
  };

  const checkUserRole = () => {
    const token = localStorage.getItem('token'); // Assume token is stored in local storage
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
      setIsAdmin(decodedToken.isAdmin); // Set isAdmin based on the token
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch('http://localhost:5000/api/user-count', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const videoResponse = await fetch('http://localhost:5000/api/video-count', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (!userResponse.ok || !videoResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const userData = await userResponse.json();
        const videoData = await videoResponse.json();

        setUserCount(userData.count);
        setVideoCount(videoData.count);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole(); // Check user role on component mount
    fetchData(); // Fetch data
  }, []);

  if (loading) return <div>Loading dashboard data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Middle section */}
        <div className="dashboard-main">
          <h1>Welcome to Your Dashboard</h1>
          <p>Here you can manage your account, view your progress, and access other features.</p>

          {isAdmin && ( // Only show admin-specific features
            <div className="dashboard-stats">
              <div className="stat-box">
                <h2>Total Users</h2>
                <p>{userCount} Users</p>
              </div>

              <div className="stat-box">
                <h2>Total Videos Uploaded</h2>
                <p>{videoCount} Videos</p>
              </div>
            </div>
          )}

          {isAdmin && ( // Only show the Upload Video button for admins
            <>
              <button onClick={toggleUpload} className="upload-btn">
                {isUploadOpen ? 'Cancel Upload' : 'Upload Video'}
              </button>
              {isUploadOpen && <VideoUpload onClose={toggleUpload} />}
            </>
          )}

          {isAdmin && ( // Link to Progress Chart for admins
            <div className="progress-link">
              <Link to="/admin/ProgressChart">
                View Progress Chart
              </Link>
            </div>
          )}

          <div>
            <h2>Upcoming Classes</h2>
            <p>No upcoming classes scheduled.</p>
          </div>

          <div>
            <h2>Recent Activity</h2>
            <p>You have not completed any classes recently.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

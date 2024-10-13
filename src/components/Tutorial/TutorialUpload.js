import React, { useState } from 'react';
import './tutorialUpload.css'; // Import CSS for this component

const TutorialUpload = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [message, setMessage] = useState('');

  const handleMediaChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('media', media);

    try {
      const response = await fetch('http://localhost:5000/api/upload-tutorial', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setMessage('Tutorial uploaded successfully!');
      } else {
        setMessage('Failed to upload tutorial');
      }
    } catch (error) {
      setMessage('An error occurred while uploading the tutorial');
    }
  };

  return (
    <div className="tutorial-upload-container">
      <h2>Upload New Tutorial</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Upload Media:
          <input
            type="file"
            onChange={handleMediaChange}
            accept="video/*,image/*"
            required
          />
        </label>
        <button type="submit">Upload Tutorial</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={onClose} className="cancel-btn">Close</button>
    </div>
  );
};

export default TutorialUpload;

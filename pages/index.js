import React, { useState } from 'react';

const HomePage = () => {
  const [file, setFile] = useState(null); // Selected file
  const [thumbnail, setThumbnail] = useState(''); // Thumbnail URL
  const [loading, setLoading] = useState(false); // Loading state
  const [uploadProgress, setUploadProgress] = useState(0); // Upload progress
  const [isDragging, setIsDragging] = useState(false); // Dragging state

  // Handle file validation (only video files)
  const handleFileValidation = (file) => {
    const validVideoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();

    // Validate MIME type or file extension
    if (file.type.startsWith('video/') || validVideoExtensions.includes(fileExtension)) {
      return true;
    }
    return false;
  };

  // Handle file selection via input
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const selectedFile = files[0];
      if (handleFileValidation(selectedFile)) {
        setFile(selectedFile); // Update state with valid file
      } else {
        alert('Please upload a valid video file (mp4, mov, avi, mkv, webm).');
      }
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false); // Reset dragging state

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const droppedFile = files[0];
      if (handleFileValidation(droppedFile)) {
        setFile(droppedFile); // Update state with valid file
      } else {
        alert('Please upload a valid video file (mp4, mov, avi, mkv, webm).');
      }
    }
  };

  // Handle drag over event to change color of box
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true); // Indicate dragging
  };

  // Handle drag leave event to reset box color
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false); // Reset dragging
  };

  // Handle video upload and thumbnail generation
  const handleSearch = async () => {
    if (!file) {
      alert('Please upload a video file.');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('video', file); // 'video' should match the backend parameter name

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
        headers: { 
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to process video");
      }

      const data = await response.json();
      setThumbnail(data.thumbnail_url || 'https://via.placeholder.com/480x360.png?text=Thumbnail'); // Placeholder for missing URL
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Download generated thumbnail
  const downloadImage = () => {
    if (!thumbnail) return;
    const link = document.createElement("a");
    link.href = thumbnail;
    link.download = "thumbnail.png";
    link.click();
  };

  return (
    <div
      className="container"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="logo-container">
        <img 
          src="/images/Asset 273.png" 
          alt="Logo" 
          className="logo" 
          style={{ width: '40px', height: 'auto' }} 
        />
        <h2 className="product-name">SpotNxt</h2>
      </div>

      <h1 className="title">Upload your video, watch the magic happen!</h1>

      {/* Drag-and-Drop Area */}


      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input').click()}
      >
        <img
        src="/icon/uploadgreen.png" // Replace with your video file icon path
        alt="Upload Icon"
        className="upload-icon"
      />
      <p className="upload-text">Drag & drop your file here or choose files</p>

      
        <input
          id="file-input"
          type="file"
          onChange={handleFileSelect}
          className="file-input"
          accept="video/*"
        />
      </div>

      {/* Show selected file name */}
      {file && !loading && (
        <div className="file-info">
          <p>Selected file: {file.name}</p>
        </div>
      )}

      {/* Show Upload Progress */}
      {loading && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
          <span className="progress-text">{uploadProgress}%</span>
        </div>
      )}

      {/* Generate Thumbnail Button */}
      <button onClick={handleSearch} className="generate-button">
        {loading ? 'Processing...' : 'Generate'}
      </button>

      {/* Show Thumbnail */}
      {thumbnail && !loading && (
        <div className="thumbnail-box">
          <img 
            src={thumbnail} 
            alt="Video Thumbnail" 
            className="thumbnail" 
            style={{ 
              maxWidth: '480px', 
              height: 'auto', 
              borderRadius: '8px' 
            }} 
          />
          <button className="download-button" onClick={downloadImage}>
            Download
          </button>
        </div>
      )}

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #000;
          color: #fff;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .logo-container {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 2;
        }

        .title {
          font-size: 2rem;
          color: #ffffff;
          margin-bottom: 1.5rem;
          white-space: nowrap;
          overflow: hidden;
          border-right: 3px solid #FFA500;
          animation: typing 6s steps(40, end), blink-caret 0.5s step-end 6 alternate;
          animation-fill-mode: forwards;
        }

        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes blink-caret {
          0%, 100% { border-color: transparent; }
          50% { border-color: #FFA500; }
        }
        .product-name {
          font-family: 'Intim', sans-serif; /* Apply Intim font */
          font-size: 1.5rem;
          color: #ffffff;
          font-weight: bold;
        }
       .upload-area {
          width: 60%; /* Adjusted width */
          max-width: 600px; /* Optional: Limit max width */
          height: 200px;
          padding: 1rem;
          border-radius: 20px;
          background-color: #333;
          color: #fff;
          margin: 2rem 0;
          text-align: center;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          transition: background-color 0.3s ease;
          position: relative;
        }

        .upload-area .upload-icon {
          width: 80px; /* Adjust size of the icon */
          height: 80px;
          margin-bottom: 30px; /* Space between icon and text */
        }

        .upload-area .upload-text {
          font-size: 1.2rem;
          font-weight: bold; /* Make the text bold */
        }

        /* Hidden file input, but still clickable */
        .upload-area .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }



        .upload-area.dragging {
          background-color: #444;
          border-color: #FFA500;
          transform: scale(0.95);
        }

        .upload-area:hover {
          background-color: #444;
        }

        .upload-area p {
          margin: 0;
          font-size: 1.2rem;
        }
        

        .file-input {
          display: none;
        }

        .progress-container {
          width: 80%;
          max-width: 800px;
          height: 10px;
          background-color: #555;
          margin: 1rem 0;
        }

        .progress-bar {
          height: 100%;
          background-color: #FFA500;
          width: 0;
        }

        .progress-text {
          color: #fff;
          font-size: 1.2rem;
          margin-top: 0.5rem;
        }

        .generate-button {
          background-color: #FFA500;
          color: #fff;
          border: none;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .generate-button:hover {
          background-color: #cc8400;
        }

        .thumbnail-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .download-button {
          background-color: #FFA500;
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .download-button:hover {
          background-color: #cc8400;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
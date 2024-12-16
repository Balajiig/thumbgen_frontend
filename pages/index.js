import React, { useState } from 'react';
import { useRouter } from 'next/router';


const HomePage = () => {
  const [file, setFile] = useState(null); // Selected file
  const [thumbnail, setThumbnail] = useState(''); // Thumbnail URL
  const [loading, setLoading] = useState(false); // Loading state
  const [uploadProgress, setUploadProgress] = useState(0); // Upload progress
  const [isDragging, setIsDragging] = useState(false); // Dragging state
  const router = useRouter(); 

  // Handle file validation (only video files)
  const handleFileValidation = (file) => {
    const validVideoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();
  
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
    setUploadProgress(0); // Reset progress at start
    const formData = new FormData();
    formData.append('video', file);

    try {
        const response = await fetch("https://thumbgen-backend.spotnxt.com/generate-thumbnail/", {
            method: "POST",
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error("Failed to process video");
        }

        // Handle binary data for the thumbnail
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("image/")) {
            const blob = await response.blob(); // Get the binary data
            const thumbnailURL = URL.createObjectURL(blob); // Create a URL for the image
            setThumbnail(thumbnailURL);
        } else {
            const data = await response.json(); // Parse JSON if content is not binary
            setThumbnail(data.thumbnail_url || 'https://via.placeholder.com/480x360.png?text=Thumbnail');
        }

        // Simulate progress 
        for (let i = 0; i <= 100; i += 10) {
            setUploadProgress(i);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        setLoading(false);
    } catch (error) {
        alert(`Error: ${error.message}`);
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

   // Cancel file selection
   const cancelFileSelection = () => {
    setFile(null); // Reset the file state
    setThumbnail(''); // Clear thumbnail
    setUploadProgress(0); // Reset progress
  };

   // Function to navigate to the "Coming Soon" page
   const editImage = () => {
    router.push('/edit'); // Navigate to the new page
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
          src="/images/logosn.webp" 
          alt="Logo" 
          className="logo" 
          style={{ width: '40px', height: 'auto' }} 
        />
        <h2 className="product-name">Spot Nxt</h2>
        <span className="beta-version">βeta</span> 
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
          src="/icon/uploadgreen.png"
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

      {/* File Information Bar or Progress Bar */}
      {!thumbnail && (
        loading && uploadProgress < 100 ? (
          <div className="progress-container glassmorphism">
            <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
            <span className="progress-text">{uploadProgress}%</span>
          </div>
        ) : (
          file && (
            <div className="file-info-bar">
              <img src="/icon/play.png" alt="Video Icon" className="file-icon" />
              <div className="highlight">
                <div className="file-details">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button className="cancel-button" onClick={cancelFileSelection} title="Cancel your selected file"> &times; </button>
              </div>
              <button className="generate-button" onClick={handleSearch} title="Generate Thumbnail"> ↑ </button>
            </div>
          )
        )
      )}

      {/* Show Thumbnail after Upload Completes */}
      {thumbnail && (
          <div className="thumbnail-box">
            <div className="button-container">
            <button className="icon-button glassmorphism" onClick={downloadImage}>
              <img src="/icon/download.png" alt="Download" className="icon" />
            </button>
            <button className="icon-button glassmorphism" onClick={editImage}>
              <img src="/icon/edit.png" alt="Edit" className="icon" />
            </button>
            </div>
            <img 
              src={thumbnail} 
              alt="Generated Thumbnail" 
              className="thumbnail" 
              style={{ 
                width: '300px', 
                height: '300px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' 
              }} 
            />
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
          color: #121212;
          text-align: center;
          position: relative;
          overflow: hidden;
          background-color: #121212;
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
          .beta-version {
          font-size: 0.9rem;
          color: #ffcc00; /* Yellow color for Beta */
          margin-top: 0.5rem; /* Space between product name and beta version */
          font-weight: bold;
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
          border-radius: 12px;
          background-color: #333;
          background-color: #252525;
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
          border-color: #28a745;
          border: 2px dashed #28a745;
          transform: scale(0.95);
        }

        .upload-area:hover {
          background-color: #444;
        }

        .upload-area p {
          margin: 0;
          font-size: 1.2rem;
        }
      
       .file-info-bar {
            width: 60%; 
            max-width: 600px; 
            height: 60px; 
            background-color: #252525; /* Same color as upload area */
            display: flex; 
            align-items: center; 
            padding: 0.5rem; 
            margin-top: 10px; 
            margin-bottom:10px;
            border-radius: 12px; 
            color: #fff; 
        }

        .file-icon {
            width: 30px; 
            height: 30px; 
            margin-right: 20px; 
            margin-left: 20px;
        }
        .highlight {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #444;
            border-radius: 10px;
            margin-top: 1rem;
            margin-bottom: 1rem;
          
        }

        .file-details {
          display: flex;
          justify-content: space-between; /* Ensures filename and size stay on the same line */
          align-items: center; /* Vertically aligns them */
          width: 100%; /* Ensures the flexbox spans the full width of the container */
          padding: 0 10px; /* Optional: Adds spacing */
        }

        .file-name {
          font-weight: bold;
          font-size: 1rem;
          color: white;
          flex: 1; /* Allows the filename to take up available space */
          overflow: hidden; /* Ensures long filenames don’t overflow */
          text-overflow: ellipsis; /* Adds '...' for long filenames */
          white-space: nowrap; /* Prevents wrapping to the next line */
        }

        .file-size {
          font-size: 0.9rem;
          color: #bbb;
          margin-left: 10px; /* Adds spacing between filename and size */
        }

        .cancel-button { /* Cancel button style */
            background-color:#252525; /* Transparent button with same background as info bar */
            border-radius:50%; /* Circular button */
            border:none; /* No border */
            color:white; /* White color for cancel sign */
            font-size:1rem; /* Size of cancel sign */
            cursor:pointer; /* Pointer cursor */
            width:25px; /* Width of circular button */
            height:25px; /* Height of circular button */
            display:flex; /* Flexbox for centering content inside button */
            align-items:center; /* Center vertically */
            justify-content:center; /* Center horizontally */
            margin-left:.5rem; /* Space between name and cancel button */
            margin-right: .5rem;
        }
    
        .cancel-button:hover {
            background-color:red; /* Change to red on hover for visibility */
        }
        .file-input {
          display: none;
        }

         .generate-button { /* Generate button style */
              background-color:#28a745; /* Green circular button */
              border:none; /* No border */
              color:white; /* White color for arrow sign */
              font-size:2rem; /* Size of arrow sign */
              cursor:pointer; /* Pointer cursor */
              width:40px; /* Width of circular button */
              height:40px; /* Height of circular button */
              border-radius:50%; /* Circular shape */
              display:flex; /* Flexbox for centering content inside button */
              align-items:center; /* Center vertically */
              justify-content:center; /* Center horizontally */
              margin-left:auto; /* Push to the right end of info bar */  
              margin-right: .0rem;
          }

            .generate-button:hover {
                background-color:#218838; /* Darker green on hover */
            }

          .progress-container {
              width: 60%;
              max-width: 600px;
              height: 60px; /* Adjust height for visibility */
              background: rgba(255, 255, 255, 0.1); /* Semi-transparent white */
              backdrop-filter: blur(1px); /* Blur background */
              border-radius: 50px; /* Rounded corners */
              margin: 1rem auto; /* Centered */
              position: relative;
          }

          .progress-bar {
              height: 100%;
              border-radius: 50px; /* Rounded corners */
              background-color: #28a745; /* Orange color for progress */
          }

          .progress-text {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: #fff;
              font-size: 1.5rem; /* Adjust font size */
          }
      

        .icon-button {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          border: none;
          padding: 10px;
          cursor: pointer;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .icon-button:hover {
          transform: scale(1.1);
        }

        .icon-button .icon {
          width: 15px;
          height: 15px;
        }

        .button-container {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
        }

        .thumbnail-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
          background-color: #1e1e1e;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          max-width: 300px;
          margin: 0 auto;
          position: relative;
        }

        .thumbnail {
          border-radius: 12px;
          max-width: 100%;
          height: auto;
          object-fit: cover;
        }

      `}</style>
    </div>
  );
};

export default HomePage;
import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle drag and drop functionality
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  // Handle search and upload
  const handleSearch = async () => {
    if (!file) {
      alert('Please upload a video file.');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch("http://127.0.0.1:8000/process_video_or_url", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload video");
      }

      await response.json(); // Removed unused data variable

      // Assuming you get a thumbnail URL or some other data from FastAPI:
      setThumbnail('https://via.placeholder.com/480x360.png?text=Thumbnail'); // Example placeholder

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!thumbnail) return;

    const link = document.createElement("a");
    link.href = thumbnail;
    link.download = "thumbnail.png"; // Default name for the downloaded image
    link.click();
  };

  return (
    <div className="container">
      <Head>
        <title>Spotnxt - Video Thumbnail Generator</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Social+Act&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="logo-container">
        <Image src="/images/Asset 273.png" alt="Logo" className="logo" width={40} height={40} />
        <h2 className="product-name">Spotnxt</h2>
      </div>

      <h1 className="title">Upload your video, watch the magic happen!</h1>

      <div
        className="upload-area"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p>Drag and drop your video here</p>
        <input
          type="file"
          onChange={handleFileSelect}
          className="file-input"
          accept="video/*"
        />
      </div>

      {loading && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
          <span className="progress-text">{uploadProgress}%</span>
        </div>
      )}

      <button onClick={handleSearch} className="generate-button">Generate</button>

      {loading && <div className="thumbnail-skeleton"></div>}

      {thumbnail && !loading && (
        <div className="thumbnail-box">
          <Image src={thumbnail} alt="Video Thumbnail" className="thumbnail" width={480} height={360} />
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

        .logo {
          width: 40px;
          height: auto;
        }

        .product-name {
          font-size: 1.5rem;
          color: #ffffff;
          font-family: 'Social Act', sans-serif;
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

        .upload-area {
          width: 80%;
          max-width: 800px;
          height: 200px;
          padding: 1rem;
          border: 1px solid #fff;
          border-radius: 20px;
          background-color: #333;
          color: #fff;
          margin: 2rem 0;
          text-align: center;
          cursor: pointer;
          transition: background-color 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }

        .upload-area:hover {
          background-color: #444;
        }

        .upload-area p {
          margin: 0;
          font-size: 1.2rem;
          font-family: 'Social Act', sans-serif;
        }

        .file-input {
          display: none;
        }

        .generate-button {
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 20px;
          background-color: #FFA500;
          color: #121212;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.5);
          margin-top: 1rem;
        }

        .generate-button:hover {
          background-color: #ff8c00;
          box-shadow: 0 0 15px rgba(255, 140, 0, 0.6), 0 0 30px rgba(255, 140, 0, 0.6);
        }

        .progress-container {
          width: 80%;
          max-width: 800px;
          margin-top: 1rem;
          height: 20px;
          background-color: #444;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }

        .progress-bar {
          height: 100%;
          background-color: #FFA500;
          transition: width 0.3s ease;
        }

        .progress-text {
          position: absolute;
          top: 0;
          right: 10px;
          color: #fff;
          font-weight: bold;
          font-size: 1rem;
        }

        .thumbnail-skeleton {
          width: 480px;
          height: 360px;
          background-color: #333;
          border-radius: 16px;
          margin-top: 2rem;
          animation: pulse 1.5s infinite;
          z-index: 2;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .thumbnail-box {
          margin-top: 2rem;
          position: relative;
          width: 480px;
          height: 360px;
          overflow: hidden;
          border-radius: 24px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 2;
        }

        .thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .download-button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          border: none;
          background-color: #FFA500;
          color: #121212;
          border-radius: 20px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .download-button:hover {
          background-color: #ff8c00;
        }
      `}</style>
    </div>
  );
};

export default HomePage;

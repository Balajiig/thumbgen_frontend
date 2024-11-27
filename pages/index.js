import React, { useState } from 'react';
import Head from 'next/head';

const HomePage = () => {
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  // http://thumbgen-backend.spotnxt.com/process_youtube_url

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/process_youtube_url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }), // Match the FastAPI model
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate thumbnail");
      }
  
      // Convert response to a Blob (binary data)
      const imageBlob = await response.blob();
  
      // Create an object URL for the image
      const imageUrl = URL.createObjectURL(imageBlob);
  
      setThumbnail(imageUrl); // Set the thumbnail for display
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const downloadImage = () => {
    if (!thumbnail) return;
  
    // Trigger download of the image
    const link = document.createElement("a");
    link.href = thumbnail;
    link.download = "thumbnail.png"; // Default name for the downloaded image
    link.click();
  };
  

  return (
    <div className="container">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Social+Act&display=swap"
          rel="stylesheet"
        />
      </Head>
      
      {/* Logo and product name at top-left */}
      <div className="logo-container">
        <img src="images/Asset 273.png" alt="Logo" className="logo" />
        <h2 className="product-name">Spotnxt</h2>
      </div>

      <div className="floating-cards">
        <div className="card">Paste your YouTube video link</div>
        <div className="card">Hit & watch the magic happen!</div>
        <div className="card">Download & Shine </div>
      </div>
      <h1 className="title">Paste your YouTube URL below</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={handleInputChange}
          className="input"
        />
        <button onClick={handleSearch} className="button">Generate</button>
      </div>

      {loading && <div className="thumbnail-skeleton"></div>}

      {thumbnail && !loading && (
        <div className="thumbnail-box">
          <img src={thumbnail} alt="YouTube Thumbnail" className="thumbnail" />
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

        /* Logo and Product Name */
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

        .floating-cards {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
          z-index: 2;
        }

        .card {
          padding: 1.5rem;
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          color: #fff;
          width: 150px;
          height: 100px;
          text-align: center;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .search-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          z-index: 2;
          width: 60%;
        }

        .input {
          padding: 0.75rem 1rem;
          width: 100%;
          max-width: 600px;
          border: none;
          border-radius: 20px;
          outline: none;
          background-color: #333;
          color: #FFFFFF;
          font-size: 1rem;
        }

        .input::placeholder {
          color: #FFFFFF;
        }

        .button {
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 20px;
          background-color: #FFA500;
          color: #121212;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.5);
        }

        .button:hover {
          background-color: #ff8c00;
          box-shadow: 0 0 15px rgba(255, 140, 0, 0.6), 0 0 30px rgba(255, 140, 0, 0.6);
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
          border-radius: 24px;
        }

        .download-button {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 12px;
          background-color: #333;
          color: #ffffff;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .download-button:hover {
          background-color: #444;
        }
      `}</style>
    </div>
  );
};

export default HomePage;

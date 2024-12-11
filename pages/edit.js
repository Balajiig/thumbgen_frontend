// pages/coming-soon.js
import React, { useState } from 'react';

const EditPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    if (email) {
      // Handle email submission logic here
      console.log('Email submitted:', email);
      setSubmitted(true);
    }
  };

  const handleHomeRedirect = () => {
    // Redirect to home or another page
    window.location.href = '/'; // Adjust with your actual home page route
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Coming Soon</h1>
      <p style={styles.subheading}>Stay updated! Enter your email below and we&apos;ll notify you.</p>
      
      {submitted ? (
        <>
          <p style={styles.successMessage}>Thank you for subscribing! We&apos;ll notify you soon.</p>
          <button onClick={handleHomeRedirect} style={styles.homeButton}>
            Go to Home
          </button>
        </>
      ) : (
        <div style={styles.emailContainer}>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            style={styles.emailInput}
          />
          <button onClick={handleSubmit} style={styles.submitButton}>
            Notify Me
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#121212',
    color: '#fff',
    textAlign: 'center',
  },
  heading: {
    fontSize: '3rem',
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  emailContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0', // No gap, button inside input bar
  },
  emailInput: {
    padding: '12px',
    fontSize: '1rem',
    width: '300px',
    border: '1px solid rgba(255, 255, 255, 0.3)', // Light border for the input field
    borderRadius: '10px 0 0 10px', // Rounded left side
    backgroundColor: 'rgba(35, 35, 35, 0.6)', // Similar to the ChatGPT search bar background
    backdropFilter: 'blur(10px)', // Glassmorphism blur effect
    color: '#d3d3d3', // Light grey text color
    outline: 'none',
    transition: 'all 0.3s ease',
    paddingRight: '0', // Remove extra padding to make space for the button
  },
  submitButton: {
    padding: '12px 20px',
    fontSize: '1rem',
    backgroundColor: 'rgba(144, 238, 144, 0.6)', // Light green background
    border: '1px solid rgba(144, 238, 144, 0.8)', // Green border
    borderRadius: '0 10px 10px 0', // Rounded right side for the button
    color: '#000000', // Green text color
    cursor: 'pointer',
    backdropFilter: 'blur(10px)', // Glassmorphism blur effect
    transition: 'all 0.3s ease',
    outline: 'none',
    boxShadow: '0 0 10px rgba(144, 238, 144, 0.4)', // Light green shadow on hover for the button
  },
  homeButton: {
    padding: '12px 20px',
    fontSize: '1rem',
    backgroundColor: 'rgba(144, 238, 144, 0.6)', // Light green background (same as submit button)
    border: '1px solid rgba(144, 238, 144, 0.8)', // Green border
    borderRadius: '10px', // Rounded corners
    color: '#000000', // Green text color
    cursor: 'pointer',
    backdropFilter: 'blur(10px)', // Glassmorphism blur effect
    transition: 'all 0.3s ease',
    outline: 'none',
    boxShadow: '0 0 10px rgba(144, 238, 144, 0.4)', // Green shadow for hover effect
  },
  successMessage: {
    fontSize: '1.5rem',
    color: '#28a745',
  },
};

export default EditPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Oops! Something went wrong.</h1>
      <p style={styles.message}>
        We could not find the page you are looking for, or an unexpected error occurred.
      </p>
      <button onClick={handleGoBack} style={styles.button}>
        Go Back to Home
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height
    textAlign: 'center',
    padding: '20px', // Padding around the container
    backgroundColor: '#f8f9fa', // Light background color
  },
  heading: {
    fontSize: '2rem',
    margin: '20px 0', // Margin around the heading
    color: '#343a40', // Darker text color
  },
  message: {
    fontSize: '1.2rem',
    margin: '10px 0', // Margin around the message
    color: '#6c757d', // Gray text color
  },
  button: {
    padding: '10px 20px',
    marginTop: '20px', // Space above the button
    backgroundColor: '#007BFF', // Blue background
    color: '#FFFFFF', // White text
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default ErrorPage;

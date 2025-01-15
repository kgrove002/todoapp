import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router';
import axios from 'axios';
import "./css/ForgotPassword.css";

function ForgotPassword() {

  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [tempData, setTempData] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const checkAccount = async () => {
    try {
      const response = await axios.post('https://kgtodoappbackend.onrender.com/forgotPassword', { email, pin });
      if (response.data) {
        setError(null);
        setTempData(response.data);
        console.log(response);
        return true;  // Return true if login is successful
      }
    } catch (err) {
      setError(err.response && err.response.status === 404 ? 'User not found' : 'Server error');
      return false;  // Return false if login fails
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    const forgotPasswordSuccess = await checkAccount(email, pin);
    if (!forgotPasswordSuccess) {
      alert("That email and PIN combination does not exist. Please try again!");
    }
  };

  const sendForgotPasswordEmail = (email) => {
    if (!tempData) {
      alert("No user data found.");
      return;
    }

    const templateParams = {
      email,
      subject: "Forgot Password To KG To Do App",
      message: `Hello ${tempData.first_name},\n
                We are sorry you have lost your password. Your password is\n
                Password: ${tempData.password}\n
                Please keep your password handy or update it in the app. Thank you again for your continued support.`
    };

    emailjs.send('gmail', 'template_o5lkw6u', templateParams, 'RnG8-IShnu5RbTCZN')
      .then(result => {
        alert("Password found successfully. An email has been sent to you with your account details.");
        // Clear form fields after email is sent
        setPin('');
        setEmail('');
        setTempData(null);
      }, error => {
        alert("Password was found, but the email failed to send. Please try again later.");
        console.log(error);
      });
  };

  // useEffect to send the email when tempData is updated
  useEffect(() => {
    if (tempData) {
      sendForgotPasswordEmail(email); // Automatically send email when tempData is updated
    }
  }, [tempData]); // Only runs when tempData is updated

  return (
    <div className='app'>
      <div className='forgotPassword'>
        <div className='headings'>
          <h1>Forgot Your Password!</h1>
        </div>

        <form className='forgotForm' onSubmit={handleForgotPassword}>
          <label className='label'>Email</label>
          <input
            className='input'
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className='label'>PIN</label>
          <input
            className='input'
            id="pin"
            type="text"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <div className='buttonGrid'>
            <button type='submit'>Submit</button>
            <button onClick={() => navigate('/')}>Go Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;

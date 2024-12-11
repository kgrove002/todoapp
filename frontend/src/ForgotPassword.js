import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import { useNavigate } from 'react-router';
import axios from 'axios';
import "./css/ForgotPassword.css"

function ForgotPassword() {

  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [tempData, setTempData] = useState(null);
  // eslint-disable-next-line
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const checkAccount = async() => {
    try {
      const response = await axios.post('http://10.0.0.129:5000/forgotPassword', { email, pin });
      
      if (response.data) {
        setError(null);
        setTempData(response.data);
        return true;  // Return true if login is successful
      }
      
    } catch (err) {
      setError(err.response && err.response.status === 404 ? 'User not found' : 'Server error');
      return false;  // Return false if login fails
    }
  };

  const sendForgotPasswordEmail = (email) => {
    const templateParams = {
      email,
      subject:"Forgot Password To KG To Do App",
      message:`Hello ${tempData?.first_name},\n
              We are sorry you have lost your password. Your password is\n
              Password: ${tempData?.password}\n 
              Please keep your password handy or need be update it in the app. Thank you again for your continue support.`
    };

    emailjs.send('gmail', 'template_o5lkw6u', templateParams, 'RnG8-IShnu5RbTCZN')
      .then(result => {
        alert("Password found successfully.\nAn email has been sent to you with your account details.\nPlease check your junk folder as it can sometimes be determined as junk.\nPlease allow 5-15 minutes for your password to be sent to you.\nIf you do not receive one please email bqcritken@gmail.com with your email and pin so they may assist you.");
      }, error => {
      alert("Password was found successfully, but the email failed to send.\nPlease try again later or email bqcritken@gmail.com with your information to retrieve your information.");
      console.log(error);
    });
  };

  const handleForgotPassword = async(event) => {
    event.preventDefault();

    try {
      // Call handleLogin and wait for its completion
      const forgotPasswordSuccess = await checkAccount(email, pin);
      if (forgotPasswordSuccess) {
        sendForgotPasswordEmail(email);
        setPin('');
        setEmail('');
        setTempData(null);
      } else{
        alert("That email and PIN combination does not exist. Please try again!")
      }
    } catch (error) {
      alert("There was a server error!");
    }
  }

  return (
    <div className='app'>
      <div className='forgotPassword'>
        <div className='headings'>
          <h1>Forgot Your Password!</h1>
        </div>

        <form className='forgotForm' onSubmit={handleForgotPassword}>
         <label className='label'>Email</label>
          <input  className='input'
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}>
          </input>
          <label className='label'>PIN</label>
          <input  className='input'
            id="pin"
            type="text"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}>
          </input>        
          <div className='buttonGrid'>
            <button type='submit'>Submit</button>
            <button onClick={()=>navigate('/')}>Go Back</button>
          </div>
        </form>  
      </div>
    </div>
  )
}

export default ForgotPassword
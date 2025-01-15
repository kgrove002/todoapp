import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import axios from 'axios';
import "./css/Signup.css"
import { useNavigate } from 'react-router'

function Signup() {

  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('')

  const navigate = useNavigate();

  const addUserToDB = async (firstName, lastName, pin, password, email) => {
    try {
      const response = await axios.post('https://kgtodoappbackend.onrender.com/addCustomer', {
        firstName,
        lastName,
        pin,
        password,
        email
      });
      return response.data; // Return the response data to the caller
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(`Connection Error`);
      } else {
        setError('Server error');
      }
      return null; // Return null in case of an error
    }
  }

  const sendSignUpEmail = (email) => {
    const templateParams = {
      email,
      subject:"Welcome To The KG To Do APP",
      message:`Hello ${firstName},\n
              Thank you, for signing up with our to-do app. Below is your information in case you wish to save it at a later time.\n
              Please keep your pin handy as it is the only way to recover your account.\n
              Email: ${email}\n
              Password: ${password}\n
              Pin: ${pin}\n\n

              Please enjoy using this application. For any questions or requests, please email bqcritken@gmail.com to contact the developer of this free app.`
    };

    emailjs.send('gmail', 'template_o5lkw6u', templateParams, 'RnG8-IShnu5RbTCZN')
      .then(result => {
      alert("Signup Successful.\nPlease keep your pin handy as it is the only way to recover your account.\nPlease enjoy the app.\nAn email has been sent to you with your account details.\nPlease check your junk folder as it can sometimes be determined as junk.\nIf you do not receive a welcome email and want one please email bqcritken@gmail.com for one.\nPlease allow up 5-15 minutes for your email to be sent to you.");
      }, error => {
      alert("Signup Successful, but email failed to send. If you would like your sign-up email, please email bqcritken@gmail.com for one.");
      console.log(error);
    });
  };

  const checkEmail = async (email) => {
    try {
      const response = await axios.post('https://kgtodoappbackend.onrender.com/checkEmail', { email });
      return response.data.exists;  // Return the "exists" boolean from the response
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Tasks not found');
        console.log(error);
      } else {
        setError('Server error');
      }
      return false;  // Return false in case of an error
    }
  };

  const handleAddUser = async (event) => {
    event.preventDefault();
  
    const passwordRegex = /^(?=.*\d)\S{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailExists = await checkEmail(email);  // Await the result of the async checkEmail function
  
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email!");
    } else if (emailExists) {
      alert("That email is already taken!\nPlease select a different email!");
    } else if (!passwordRegex.test(password)) {
      alert("Password must be at least 8 characters long and contain at least 1 number");
    } else if (password !== confirmPassword) {
      alert("Please ensure both password matches");
    } else if (pin !== confirmPin) {
      alert("Please ensure both pin match!");
    } else if (pin.length !== 4 || isNaN(pin)) {
      alert("Please enter a 4-digit pin!");
    } else {
      console.log(`${firstName}, ${lastName}, ${email}, ${password}, ${pin}`);
      
      // Try adding the user to the database
      const dbResponse = await addUserToDB(firstName, lastName, pin, password, email);
  
      // Only send email if database update was successful
      if (dbResponse) {
        sendSignUpEmail(email);
        setFirstname('');
        setLastname('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPin('');
        setConfirmPin('');
      } else {
        alert("Signup failed. Please try again.");
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Prevent default Enter behavior if focus is on non-input/button element
      event.preventDefault();
      
      // Explicitly trigger the submit if Enter is pressed
      if (event.target.tagName === 'INPUT') {
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.click();
      }
    }
  };

  return (
   <div className='app'> 
      <div className='signUp'>
        <div className='headings'>
          <h1>Sign up for the KG To Do App!</h1>
        </div>
        <form className='signupForm' onSubmit={handleAddUser} onKeyDown={(event) => handleKeyPress(event)}>

          <label className='label' >First Name:</label>
            <input
              className='input'
              id="firstName"
              type="text"
              placeholder="First Name"
              required
              value={firstName}
              onChange={(e) => setFirstname(e.target.value)}>                        
            </input> 

          <label className='label' >Last Name:</label>
            <input
              className='input'
              id="firstName"
              type="text"
              placeholder="Last Name"
              required
              value={lastName}
              onChange={(e) => setLastname(e.target.value)}>                        
            </input> 

          <label className='label' >Email:</label>
            <input
              className='input'
              id="email"
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}>                        
            </input> 

          <div className='infoGrid'>
          <label className='label' >Password:</label>
          <button onClick={() => alert("Your password must be at least 8 characters long and contain at least 1 number")}>Info</button>
          </div>
            <input
              className='input'
              id="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}>                        
            </input> 

            <label className='label' >Confirm Password:</label>
            <input
              className='input'
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}>                        
            </input> 
            <div className='infoGrid'>
          <label className='label' >Pin:</label>
          <button onClick={() => alert("Your pin must be a 4-digit number")}>Info</button>
          </div>
            <input
              className='input'
              id="pin"
              type="text"
              placeholder="PIN"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}>                        
            </input> 

            <label className='label' >Confirm Password:</label>
            <input
              className='input'
              id="confirmPin"
              type="text"
              placeholder="Confirm PIN"
              required
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}>                        
            </input> 

        <div className='buttonGrid'>
          <button type='submit'>Submit</button>
          <button onClick={() => navigate('/')}>Go Back</button>
          </div>
        </form>        
      </div>

   </div>
  )
}

export default Signup
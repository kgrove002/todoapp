import React, { useEffect, useState } from 'react';
import "./css/UserSettings.css";
import axios from 'axios';
import { useNavigate } from 'react-router';

function UserSettings({ refreshData, id, email, password, pin, login, firstName }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [cofirmNewPassword, setCofirmNewPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  const [cofirmNewPin, setCofirmNewPin] = useState('');
  const [emailText, setEmailText] = useState(email);
  const [passwordPasser, setPasswordPasser] = useState(password);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false); // New state for tracking update progress

  const navigate = useNavigate();

  useEffect(() => {
    if (!login) {
      navigate('/');
    }
  }, [login, navigate]);

  useEffect(() => {
    if (isUpdating){
        refreshData(emailText, passwordPasser);
     }
    }, [isUpdating]);

  const checkEmail = async (email) => {
    try {
      const response = await axios.post('https://73.216.67.101:5000/checkEmail', { email });
      return response.data.exists; // Return the "exists" boolean from the response
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Tasks not found');
      } else {
        setError('Server error');
      }
      return false; // Return false in case of an error
    }
  };

  const updateEmailDB = async (email) => {
    try {
      const response = await axios.post('https://73.216.67.101:5000/updateEmail', {
        id,
        email,
      });
      return response.data; // Return the response data to the caller
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Fail to update email');
      } else {
        setError('Server error');
      }
      return null; // Return null in case of an error
    }
  };

  const updatePinDB = async (pin) => {
    try {
      const response = await axios.post('https://73.216.67.101:5000/updatePin', {
        id,
        pin,
      });
      return response.data; // Return the response data to the caller
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Fail to update pin');
      } else {
        setError('Server error');
      }
      return null; // Return null in case of an error
    }
  };

  const updatePasswordDB = async (password) => {
    try {
      const response = await axios.post('https://73.216.67.101:5000/updatePassword', {
        id,
        password,
      });
      return response.data; // Return the response data to the caller
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Fail to update password');
      } else {
        setError('Server error');
      }
      return null; // Return null in case of an error
    }
  };

  const updateEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (newEmail.trim() === "") {
      return { success: true };
    } else if (!emailRegex.test(newEmail)) {
      return { success: false, message: "Please enter a valid email!" };
    }

    const emailExists = await checkEmail(newEmail);
    if (emailExists) {
      return { success: false, message: "That email is already taken!\nPlease enter a different email!" };
    }

    const result = await updateEmailDB(newEmail);
    if (result) {
      setEmailText(newEmail);
      return { success: true };
    }
    return { success: false, message: "Failed to update email!" };
  };

  const updatePin = async () => {
    if (newPin.trim() === "") {
      return { success: true };
    } else if (newPin !== cofirmNewPin) {
      return { success: false, message: "Please ensure both pins match!" };
    } else if (newPin.length !== 4 || isNaN(newPin)) {
      return { success: false, message: "Please enter a 4-digit pin!" };
    }

    const result = await updatePinDB(newPin);
    if (result) {
      return { success: true };
    }
    return { success: false, message: "Failed to update pin!" };
  };

  const updatePassword = async () => {
    const passwordRegex = /^(?=.*\d)\S{8,}$/;

    if (newPassword.trim() === "") {
      return { success: true };
    } else if (newPassword !== cofirmNewPassword) {
      return { success: false, message: "Please ensure both passwords match!" };
    } else if (!passwordRegex.test(newPassword)) {
      return { success: false, message: "Password must be at least 8 characters long and contain at least 1 number!" };
    }

    const result = await updatePasswordDB(newPassword);
    if (result) {
      setPasswordPasser(newPassword);
      return { success: true };
    }
    return { success: false, message: "Failed to update password!" };
  };

  const updateSettings = async (event) => {
    event.preventDefault();

    if (currentPassword !== password) {
      alert("Your Password did not match!\nPlease try again!");
      return;
    }

    setIsUpdating(true); // Set updating state to true to prevent multiple requests

    const emailUpdateResult = await updateEmail();
    const pinUpdateResult = await updatePin();
    const passwordUpdateResult = await updatePassword();

    if (!emailUpdateResult.success) {
      alert(emailUpdateResult.message);
      setIsUpdating(false);
      return;
    }

    if (!pinUpdateResult.success) {
      alert(pinUpdateResult.message);
      setIsUpdating(false);
      return;
    }

    if (!passwordUpdateResult.success) {
      alert(passwordUpdateResult.message);
      setIsUpdating(false);
      return;
    }

    // Call refreshData only after all updates have been successful
    setIsUpdating(false);

    // Clear fields and show success message
    setCurrentPassword('');
    setNewEmail('');
    setNewPassword('');
    setCofirmNewPassword('');
    setNewPin('');
    setCofirmNewPin('');
    alert("Your information has been updated!");
  };

  return (
    <div className="App">
      <div className="userSettings">
        <div className="headings">
          <h1>User Settings</h1>
          <h1>Welcome Back {firstName}</h1>
        </div>
        <form className="updateForm" onSubmit={updateSettings}>
          <label className="label">Please enter your current password:</label>
          <input
            className="input"
            id="currentPassword"
            type="password"
            placeholder="Your Current Password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          ></input>

          <label className="label">Your current email is {emailText}. Do you wish to change it?:</label>
          <input
            className="input"
            id="newEmail"
            type="text"
            placeholder="Your New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          ></input>

          <label className="label">If you wish to change your password, please enter it here:</label>
          <input
            className="input"
            id="newPassword"
            type="text"
            placeholder="Your New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          ></input>

          <label className="label">Please confirm your new password:</label>
          <input
            className="input"
            id="cofirmNewPassword"
            type="text"
            placeholder="Please Confirm Your New Password"
            value={cofirmNewPassword}
            onChange={(e) => setCofirmNewPassword(e.target.value)}
          ></input>

          <label className="label">If you wish to change your PIN, please enter it here:</label>
          <input
            className="input"
            id="newPin"
            type="text"
            placeholder="Your New PIN"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
          ></input>

          <label className="label">Please confirm your new PIN:</label>
          <input
            className="input"
            id="cofirmNewPpin"
            type="text"
            placeholder="Please Confirm Your New PIN"
            value={cofirmNewPin}
            onChange={(e) => setCofirmNewPin(e.target.value)}
          ></input>

          <button type="submit" disabled={isUpdating}>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default UserSettings;

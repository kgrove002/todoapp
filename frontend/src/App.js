import React from "react";
import { Route, Routes } from "react-router-dom";
import ToDoList from "./ToDoList";
import GroceryList from "./GroceryList";
import Settings from "./Settings";
import Layout from "./Layout";
import UserSettings from "./UserSettings";
import { useState} from "react";
import axios from "axios";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import Error from "./ErrorPage"

function App() {
  
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post('https://kgtodoappbackend.onrender.com/login', { email, password });
      
      if (response.data) {
        setUserData(response.data);
        setError(null);
        return true;  // Return true if login is successful
      }
      
    } catch (err) {
      setError(err.response && err.response.status === 404 ? 'User not found' : 'Server error');
      alert(`There was an error. Please try again!\nError: ${error}`);
      setUserData(null);
      return false;  // Return false if login fails
    }
  }

  return (
  <Routes>
    <Route index element={<Login handleLogin={handleLogin} setLogin={setLogin} />} />
    <Route path="signup" element={<Signup />} />
    <Route path="forgotPassword" element={<ForgotPassword />} />
    <Route path="/" element={<Layout setUserData={setUserData} setLogin={setLogin} />}>
      <Route path="toDoList" element={<ToDoList id={userData?.customer_id} login={login} />} />
      <Route path="grocery" element={<GroceryList id={userData?.customer_id} login={login} />} />
      <Route path="settings" element={<Settings login={login} cusId={userData?.customer_id} />} />
      <Route path="userSettings" element={<UserSettings refreshData={handleLogin} id={userData?.customer_id} email={userData?.customer_email} password={userData?.password} pin={userData?.pin} login={login} firstName={userData?.first_name} />} />
    </Route>
    <Route path="*" element={<Error />} />
  </Routes>

  );
}

export default App;

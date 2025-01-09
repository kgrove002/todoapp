import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import "./css/Login.css"
import "./css/App.css"

function Login({handleLogin, setLogin}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

const processLogin = async (event) => {
  event.preventDefault();

  try {
    // Call handleLogin and wait for its completion
    const loginSuccess = await handleLogin(email.toLocaleLowerCase(), password);
    if (loginSuccess) {
      // Navigate to /toDoList only if login is successful
      setLogin(true);
      navigate('/toDoList');
    }
  } catch (error) {
    alert("Your email/Password is invalid!");
  }
};

  return (
    <div className='app'>
      <div className='Login'>
        <div className='headings'>
          <h1>Welcome To The KG To Do App</h1>
        </div>

        <form className='loginForm' onSubmit={processLogin}>
         <label className='label'>Email</label>
          <input  className='input'
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}>
          </input>
          <label className='label'>Password</label>
          <input  className='input'
            id="password"
            type="password"
            placeholder="Password"            
            value={password}
            onChange={(e) => setPassword(e.target.value)}>
          </input>
          <button type="submit">Submit</button>
        </form>
        <div className='buttonGrid'>
          <button onClick={()=>navigate('/signup')}>Signup</button>
          <button onClick={()=>navigate('/forGotPassword')}>Forgot Password</button>
        </div>
      </div>
    </div>
  )
}

export default Login
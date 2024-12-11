import React from "react";

import { Link } from "react-router-dom";

export default function Nav(setUserData, setLogin) {
  return (
    <nav className="mainNav">
      <ul>
        <li>
          <Link to="/toDoList">To Do</Link>
        </li>
        <li>
          <Link to="/grocery">Grocery</Link>
        </li>
        <li>
          <Link to="/settings">Day Settings</Link>
        </li>
        <li>
          <Link to="/userSettings">User Settings</Link>
        </li>
        <li>
        <Link to="/" onClick={() => { setLogin(false); setUserData(null); }}>Log Out</Link>
        </li>
      </ul>
    </nav>
  );
}

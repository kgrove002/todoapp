import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div>
      <nav className="mainNav">
        <ul>
          <li>
            <Link to="/">To Do</Link>
          </li>
          <li>
            <Link to="/grocery">Grocery</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <Link to="/aboutpage">About</Link>
          </li>
        </ul>
      </nav>

      {children}
    </div>
  );
}
